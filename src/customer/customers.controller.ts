import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CustomerResponseDto } from './dto/customer-response.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-cutomer.dto';
import { CustomersService } from './customers.service';

@Controller('customers')
@UseInterceptors(ClassSerializerInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.customersService.create(createCustomerDto);
    return plainToInstance(CustomerResponseDto, customer);
  }

  @Get()
  async findAll(@Query() query: any): Promise<CustomerResponseDto[]> {
    const filters = Object.keys(query).reduce((acc, key) => {
      if (query[key] && query[key].trim() !== '') {
        acc[key] = query[key];
      }
      return acc;
    }, {});

    const customers = await this.customersService.findAll(filters);
    return customers.map(c => plainToInstance(CustomerResponseDto, c));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CustomerResponseDto> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Customer ID is required');
    }

    const customer = await this.customersService.findOne(id);
    return plainToInstance(CustomerResponseDto, customer);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<CustomerResponseDto> {
    if (!email || email.trim() === '') {
      throw new BadRequestException('Email is required');
    }

    const customer = await this.customersService.findByEmail(email);
    return plainToInstance(CustomerResponseDto, customer);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customersService.update(id, updateCustomerDto);
    return plainToInstance(CustomerResponseDto, customer);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<CustomerResponseDto> {
    const customer = await this.customersService.deactivate(id);
    return plainToInstance(CustomerResponseDto, customer);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string): Promise<CustomerResponseDto> {
    const customer = await this.customersService.activate(id);
    return plainToInstance(CustomerResponseDto, customer);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.customersService.remove(id);
    return { message: 'Customer deleted successfully' };
  }
}
