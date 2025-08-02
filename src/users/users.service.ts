import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongodb';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        $or: [
          { userName: createUserDto.userName },
          { userEmail: createUserDto.userEmail },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this username or email already exists');
    }
    const user = new User();
    Object.assign(user, createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(filters: any = {}): Promise<User[]> {
    // Ensure filters is always a plain object
    return this.userRepository.find({ where: filters });
  }

  async findOne(id: string): Promise<User> {
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId format');
    }

    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(userEmail: string): Promise<User> {
    // Ensure email is not undefined/null
    if (!userEmail) {
      throw new Error('Email is required');
    }

    const user = await this.userRepository.findOne({
      where: { userEmail: userEmail }
    });
    if (!user) {
      throw new NotFoundException(`User with email ${userEmail} not found`);
    }
    return user;
  }

  async findByUsername(userName: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userName } });
    if (!user) {
      throw new NotFoundException(`User with username ${userName} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.userName || updateUserDto.userEmail) {
      const existingUser = await this.userRepository.findOne({
        where: [
          { userName: updateUserDto.userName },
          { userEmail: updateUserDto.userEmail },
        ],
      });

      if (existingUser && existingUser._id.toString() !== id) {
        throw new ConflictException('User with this username or email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async updateLastLogin(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.lastLogin = new Date();
    return await this.userRepository.save(user);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    return await this.userRepository.save(user);
  }

  async activate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = true;
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async getActiveUsers(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
}