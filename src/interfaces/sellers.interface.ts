import { accounts_profile } from '@prisma/client';
import { SellerProfile } from './profile.interface';

export interface SellerBase {
  id: number;
  is_superuser: number;
  seller_code: string;
  balance: number;
  address: string | null;
  email: string;
  accounts_profile?: SellerProfile;
  username?: string;
  date_joined?: string;
}

export interface SellerList {
  id: number;
  is_superuser: number;
  first_name: string;
  last_name: string;
  seller_code: string;
  balance: number;
  address: string | null;
  city?: string | null;
  country?: string | null;
  state_province?: string | null;
  email: string;
  fullname?: string | null;
  date_joined?: string;
  seller_tiers?: string[];
  accounts_profile?: SellerProfile;
}

export interface Seller extends SellerBase {
  first_name: string;
  last_name: string;
  city: string | null;
  country: string | null;
  state_province: string | null;
}

export interface SellerUpdate extends Seller {
  is_staff: number;
  is_active: number;
  phone: string;
  postal_code: string;
  bio: string;
}

export interface SellerFull extends SellerUpdate {}

export interface SellerResult extends SellerBase {
  fullname: string;
}
