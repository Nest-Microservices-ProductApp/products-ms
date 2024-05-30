import {
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsServices');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database Conected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
    // return 'This action adds a new product';
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPage = await this.product.count({where: {available:true}});
    const lastPage = Math.ceil(totalPage / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where:{
          available:true
        }
      }),
      meta: {
        total: totalPage,
        page,
        lastPage,
      },
    };
    // return `This action returns all products`;
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({ where: { id, available: true } });

    if (!product) 
      throw new RpcException({
        message: `Product with id #${ id } not found`,
        status: HttpStatus.NOT_FOUND
      });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto
    await this.findOne(id);
    return await this.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
    return product;
  }
}
