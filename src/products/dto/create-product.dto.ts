import { Type } from 'class-transformer';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  // @IsNotEmpty()
  // readonly description: string;

  @IsPositive()
  @Type(() => Number)
  price: number;
}
