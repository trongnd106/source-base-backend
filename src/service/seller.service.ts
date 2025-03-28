import { Service } from 'typedi';
import { Prisma, PrismaClient } from '@prisma/client';
import { Seller, SellerFull, SellerList, SellerResult } from '@/interfaces/sellers.interface';
import { SellerProfile } from '@/interfaces/profile.interface';
import { HttpException } from '@exceptions/HttpException';
import { GetQuerySellerDto, QuerySeller, UpdateDto } from '../dtos/admin/sellers.dto';
import { UpdateProfileDto } from '../dtos/admin/sellers.dto';
import { createPaginator, PaginatedResult } from '@/utils/pagination';
import { ConstValue } from '@/utils/constant';
import { logger } from '@/utils/logger';

@Service()
export class SellerService {
  private prisma = new PrismaClient();

  public async findAll({ page, search }: GetQuerySellerDto): Promise<PaginatedResult<SellerList>> {
    const paginate = createPaginator({ page, perPage: ConstValue.SELLER_PAGE_LIMIT });

    try {
      const result = await paginate<SellerList, Prisma.accounts_customuserFindManyArgs>(this.prisma.accounts_customuser, {
        where: {
          username: {
            contains: search,
          },
        },
        include: {
          accounts_profile: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      const sellers: SellerList[] = result.data.map(user => ({
        id: user.id,
        is_superuser: user.is_superuser,
        first_name: user.first_name,
        last_name: user.last_name,
        seller_code: user.accounts_profile?.seller_code || '',
        balance: user.accounts_profile?.balance || 0,
        address: user.address + user.city + user.country,
        fullname: user.fullname,
        date_joined: user.date_joined,
        email: user.email,
      }));

      return { ...result, data: sellers };
    } catch (err) {
      console.log(err);
      throw new HttpException(500, 'Internal Server Error');
    }
  }

  async findById(userId: number): Promise<SellerFull | null> {
    try {
      var user = await this.prisma.accounts_customuser.findFirst({
        where: {
          id: userId,
        },
        include: {
          accounts_profile: true,
        },
      });
    } catch (err) {
      logger.error(err.message);
      throw new HttpException(500, 'Internal Server Error');
    }

    if (!user) throw new HttpException(404, 'Seller not found');

    const seller: SellerFull = {
      id: user.id,
      is_superuser: user.is_superuser,
      is_staff: user.is_staff,
      is_active: user.is_active,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.accounts_profile.phone,
      bio: user.accounts_profile.bio,
      postal_code: user.accounts_profile.postal_code,
      seller_code: user.accounts_profile.seller_code,
      balance: user.accounts_profile.balance,
      address: user.accounts_profile.address,
      city: user.accounts_profile.city,
      country: user.accounts_profile?.country,
      state_province: user.accounts_profile?.state_province,
      email: user.email,
    };

    return seller;
  }

  public async doUpdate(userId: number, userData: UpdateDto): Promise<{ message: string }> {
    // TODO: Check duplicate email address
    const findSeller = await this.prisma.accounts_customuser.findFirst({
      where: { id: userId },
      include: {
        accounts_profile: true,
      },
    });

    if (!findSeller) {
      throw new HttpException(404, 'Seller not found');
    }

    const dataToUpdate = {
      is_superuser: userData.is_superuser,
      is_staff: userData.is_staff,
      is_active: userData.is_active,
      first_name: userData.first_name,
      last_name: userData.last_name,
      accounts_profile: {
        update: {
          data: {
            seller_code: userData.seller_code,
            address: userData.address,
            city: userData.city,
            country: userData.country,
            state_province: userData.state_province,
            phone: userData.phone,
            postal_code: userData.postal_code,
            bio: userData.bio,
          },
        },
      },
    };

    try {
      var updatedUser = await this.prisma.accounts_customuser.update({
        where: { id: userId },
        data: dataToUpdate,
        include: {
          accounts_profile: true,
        },
      });
    } catch (err) {
      logger.error(err.message);
      throw new HttpException(500, 'Internal Server Error');
    }

    return {
      message: 'Success',
    };
  }

  public async doTopUp(userId: number, top_up_amount: number): Promise<{ balance: number }> {
    try {
      var findSellerProfile = await this.prisma.accounts_profile.findFirst({
        where: {
          id: userId,
        },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(500, 'Internal Server Error');
    }

    if (!findSellerProfile) throw new HttpException(404, 'Not found');
    const newBalance = parseFloat((findSellerProfile.balance + top_up_amount).toFixed(2));
    const updateSeller: SellerProfile = await this.prisma.accounts_profile.update({
      where: {
        user_id: userId,
      },
      data: {
        balance: newBalance,
      },
    });
    return {
      balance: updateSeller.balance,
    };
  }

  public async doDeduct(userId: number, deduct_amount: number): Promise<{ balance: number }> {
    try {
      var findSellerProfile = await this.prisma.accounts_profile.findFirst({
        where: {
          id: userId,
        },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(500, 'Internal Server Error');
    }

    if (!findSellerProfile) throw new HttpException(404, 'Not found');

    if (findSellerProfile.balance < deduct_amount) throw new HttpException(400, 'Bab Request');

    const newBalance = parseFloat((findSellerProfile.balance - deduct_amount).toFixed(2));

    const updateSeller: SellerProfile = await this.prisma.accounts_profile.update({
      where: {
        user_id: userId,
      },
      data: {
        balance: newBalance,
      },
    });
    return {
      balance: updateSeller.balance,
    };
  }

  // TODO: rename function
  public async updateProfileFromOrder(profileData: UpdateProfileDto): Promise<SellerProfile> {
    try {
      const findSellerProfile = await this.prisma.accounts_profile.findFirst({
        where: {
          id: profileData.userId,
        },
      });
      if (!findSellerProfile) throw new HttpException(404, 'Seller profile not found');

      const updateOrder = await this.prisma.accounts_profile.update({
        where: {
          user_id: profileData.userId,
        },
        data: {
          balance: findSellerProfile.balance + profileData.orderBalance,
          credit: findSellerProfile.credit + profileData.orderCredit,
        },
      });
      return updateOrder;
    } catch (err) {
      console.log(err);
      throw new HttpException(500, 'Internal Server Error');
    }
  }
}
