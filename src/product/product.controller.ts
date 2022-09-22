import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { FindProductDto } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create.product.dto';
import { ProductService } from './product.service';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constant';
import { ProductDocument } from './product.model';
import { IProductWithReviews } from './product.types';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post()
    async create(
        @Body() dto: CreateProductDto,
    ): Promise<ProductDocument | null> {
        return this.productService.create(dto);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<ProductDocument> {
        const product = await this.productService.findById(id);
        if (!product) {
            throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
        }
        return product;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const product = await this.productService.deleteById(id);
        if (!product) {
            throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: CreateProductDto,
    ): Promise<ProductDocument> {
        const product = await this.productService.updateById(id, dto);
        if (!product) {
            throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
        }
        return product;
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async find(@Body() dto: FindProductDto): Promise<IProductWithReviews[]> {
        return this.productService.findWithReviews(dto);
    }
}
