import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create.product.dto';
import { ProductDocument, ProductModel } from './product.model';
import { FindProductDto } from './dto/find-product.dto';
import { IProductWithReviews } from './product.types';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(ProductModel.name)
        private readonly productModel: Model<ProductDocument>,
    ) {}

    async create(dto: CreateProductDto): Promise<ProductDocument | null> {
        return await this.productModel.create(dto);
    }

    async findById(id: string): Promise<ProductDocument | null> {
        return this.productModel.findById(id).exec();
    }

    async deleteById(id: string): Promise<ProductDocument | null> {
        return this.productModel.findByIdAndDelete(id).exec();
    }

    async updateById(
        id: string,
        dto: CreateProductDto,
    ): Promise<ProductDocument | null> {
        return this.productModel
            .findByIdAndUpdate(id, dto, {
                new: true,
            })
            .exec();
    }

    async findWithReviews(dto: FindProductDto): Promise<IProductWithReviews[]> {
        return this.productModel
            .aggregate([
                {
                    $match: { categories: dto.category },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
                {
                    $limit: dto.limit,
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'productId',
                        as: 'reviews',
                    },
                },
                {
                    $addFields: {
                        reviewsCount: { $size: '$reviews' },
                        reviewsAvg: { $avg: '$reviews.rating' },
                    },
                },
            ])
            .exec();
    }
}
