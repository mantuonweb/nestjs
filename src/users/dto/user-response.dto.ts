import { Exclude, Expose, Transform } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  _id: string;

  @Expose()
  userName: string;

  @Expose()
  userEmail: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  roles: UserRole;

  @Expose()
  isActive: boolean;

  @Expose()
  lastLogin: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}