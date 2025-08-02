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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return plainToClass(UserResponseDto, user);
  }

  @Get()
  async findAll(@Query() query: any): Promise<UserResponseDto[]> {
    // Filter out empty query parameters
    const filters = Object.keys(query).reduce((acc, key) => {
      if (query[key] && query[key].trim() !== '') {
        acc[key] = query[key];
      }
      return acc;
    }, {});

    const users = await this.usersService.findAll(filters);
    return users.map(user => plainToClass(UserResponseDto, user));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    // Validate the ID parameter
    if (!id || id.trim() === '') {
      throw new Error('User ID is required');
    }
    
    const user = await this.usersService.findOne(id);
    return plainToClass(UserResponseDto, user);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByEmail(email);
    return plainToClass(UserResponseDto, user);
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByUsername(username);
    return plainToClass(UserResponseDto, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return plainToClass(UserResponseDto, user);
  }

  @Patch(':id/login')
  async updateLastLogin(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.updateLastLogin(id);
    return plainToClass(UserResponseDto, user);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.deactivate(id);
    return plainToClass(UserResponseDto, user);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.activate(id);
    return plainToClass(UserResponseDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}