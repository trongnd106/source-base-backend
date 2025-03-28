import { Controller, Param, Body, Get, Put, Patch, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import Container from 'typedi';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { SellerService } from '@/services/seller.service';
import { Seller, SellerResult } from '@/interfaces/sellers.interface';
import { UpdateDto, UpdateAmountDto, QuerySeller, GetQuerySellerDto } from '@/dtos/admin/sellers.dto';
import { AdminPath } from '@/utils/controllerPath';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { PaginatedResult } from '@/utils/pagination';
import { HttpException } from '@/exceptions/HttpException';
import { length } from 'class-validator';

@Controller(AdminPath.SELLERS)
@UseBefore(AuthMiddleware)
export class SellerController {
  private seller = Container.get(SellerService);

  @Get('/')
  @HttpCode(200)
  @OpenAPI({ summary: 'Return a list of sellers' })
  async getAllSellers(@QueryParams() query: GetQuerySellerDto) {
    const findAllSellerData = await this.seller.findAll(query);
    return { ...findAllSellerData, message: 'Success' };
  }

  @Get('/:id')
  @HttpCode(200)
  @OpenAPI({ summary: 'Return information of a seller' })
  async detail(@Param('id') sellerId: number) {
    const seller: Seller = await this.seller.findById(sellerId);
    return { data: seller, message: 'Success' };
  }

  @Patch('/:id')
  @HttpCode(201)
  @UseBefore(ValidationMiddleware(UpdateDto))
  @OpenAPI({ summary: 'Update info a seller' })
  async update(@Param('id') sellerId: number, @Body() userData: UpdateDto) {
    const result: { message: string } = await this.seller.doUpdate(sellerId, userData);
    return { message: result.message };
  }

  @Put('/:id/topup')
  @HttpCode(201)
  @OpenAPI({ summary: "Update seller's balance top up" })
  async topup(@Param('id') sellerId: number, @Body() topUp: UpdateAmountDto) {
    this.validateAmount(topUp.amount);
    const result: { balance: number } = await this.seller.doTopUp(sellerId, topUp.amount);
    return { data: result, message: 'Success' };
  }

  @Put('/:id/deduct')
  @HttpCode(201)
  @OpenAPI({ summary: "Update seller's balance top up" })
  async deduct(@Param('id') sellerId: number, @Body() deduct: UpdateAmountDto) {
    this.validateAmount(deduct.amount);
    const result: { balance: number } = await this.seller.doDeduct(sellerId, deduct.amount);
    return { data: result, message: 'Success' };
  }

  private validateAmount(value: number) {
    if (!value || typeof value === 'string') throw new HttpException(400, 'Bad request');

    const floatAmount = parseFloat(value.toFixed(2));
    if (floatAmount <= 0.0) throw new HttpException(400, 'Amount must be greater than 0');

    if (value.toString().split('.')[1]?.length > 2) throw new HttpException(400, 'Amount only accepts 2 decimal places');

    return true;
  }
}
