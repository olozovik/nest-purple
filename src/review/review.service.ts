import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewDocument, ReviewModel } from './review.model';
import { DeleteResult } from 'mongodb';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(ReviewModel.name)
        private readonly reviewModel: Model<ReviewDocument>,
    ) {}

    async create(dto: CreateReviewDto): Promise<ReviewDocument> {
        return await this.reviewModel.create(dto);
    }

    async delete(id: string): Promise<ReviewDocument | null> {
        return await this.reviewModel.findByIdAndDelete(id).exec();
    }

    async findByProductId(productId: string): Promise<ReviewDocument[]> {
        return await this.reviewModel
            .find({
                productId,
            })
            .exec();
    }

    async deleteByProductId(productId: string): Promise<DeleteResult> {
        return await this.reviewModel.deleteMany({ productId }).exec();
    }
}
