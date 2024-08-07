import { Controller, Param, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post('create')
  @MessagePattern({ cmd: 'create-product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get('all')
  @MessagePattern({ cmd: 'all-product' })
  findAll(@Payload() paginationDto: PaginationDto) {
    // return paginationDto;
    return this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find-one-product' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // @Patch('edit/:id')
  @MessagePattern({ cmd: 'edit-product' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete('delete/:id')
  @MessagePattern({ cmd: 'delete-product' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    console.log(id);
    
    return this.productsService.remove(id);
  }

  @MessagePattern({ cmd: 'validate-products' })
  validateProduct(@Payload() ids: number[]) {  
    return this.productsService.validateProducts(ids);
  }
}
