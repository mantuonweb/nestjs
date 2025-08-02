import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-cutomer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: MongoRepository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const existing = await this.customerRepository.findOne({
      where: {
        $or: [
          { email: createCustomerDto.email },
          { phone: createCustomerDto.phone },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Customer with this email or phone already exists');
    }

    const customer = new Customer();
    Object.assign(customer, createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async findAll(filters: any = {}): Promise<Customer[]> {
    return this.customerRepository.find({ where: filters });
  }

  async findOne(id: string): Promise<Customer> {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId format');
    }

    const customer = await this.customerRepository.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async findByEmail(email: string): Promise<Customer> {
    if (!email) {
      throw new Error('Email is required');
    }

    const customer = await this.customerRepository.findOne({ where: { email } });

    if (!customer) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    if (updateCustomerDto.email || updateCustomerDto.phone) {
      const existing = await this.customerRepository.findOne({
        where: [
          { email: updateCustomerDto.email },
          { phone: updateCustomerDto.phone },
        ],
      });

      if (existing && existing._id.toString() !== id) {
        throw new ConflictException('Customer with this email or phone already exists');
      }
    }

    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async deactivate(id: string): Promise<Customer> {
    const customer = await this.findOne(id);
    customer.isActive = false;
    return await this.customerRepository.save(customer);
  }

  async activate(id: string): Promise<Customer> {
    const customer = await this.findOne(id);
    customer.isActive = true;
    return await this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }

  async getActiveCustomers(): Promise<Customer[]> {
    return await this.customerRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
}
