// todo: fix after wrtie logic of service & controller
import { USER_ACTIVE_STATUS, USER_ADMIN_STATUS, USER_STAFF_STATUS } from '@/utils/enums';
import { IsString, IsNumber, IsNotEmpty, IsEnum, IsOptional, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  orderBalance: number;

  @IsNumber()
  orderCredit: number;
}

export class UpdateDto {
  @IsNumber()
  @IsEnum(USER_ADMIN_STATUS)
  is_superuser: number;

  @IsNumber()
  @IsEnum(USER_STAFF_STATUS)
  is_staff: number;

  @IsNumber()
  @IsEnum(USER_ACTIVE_STATUS)
  is_active: number;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  seller_code: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  state_province: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @IsString()
  bio: string;
}

export class UpdateAmountDto {
  amount: number;
}

export class QuerySeller {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @IsOptional()
  @IsString()
  search: string;
}

export class GetQuerySellerDto {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsString()
  search: string;
}
