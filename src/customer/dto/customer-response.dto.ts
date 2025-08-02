import { Exclude, Expose, Transform } from 'class-transformer';

export class CustomerResponseDto {
    @Expose()
    @Transform(({ obj }) => obj._id?.toString())
    _id: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;

    @Expose()
    phone?: string;

    @Expose()
    addressLine1?: string;

    @Expose()
    addressLine2?: string;

    @Expose()
    city?: string;

    @Expose()
    state?: string;

    @Expose()
    postalCode?: string;

    @Expose()
    country?: string;

    @Expose()
    isActive: boolean;

    @Expose()
    lastPurchaseDate?: Date;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
