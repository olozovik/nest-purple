import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewDocument } from './review.model';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() dto: CreateReviewDto): Promise<ReviewDocument> {
        return await this.reviewService.create(dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const deletedReview = await this.reviewService.delete(id);
        if (!deletedReview) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }

    @Get('byProduct/:productId')
    async getByProduct(
        @Param('productId') productId: string,
    ): Promise<ReviewDocument[]> {
        return await this.reviewService.findByProductId(productId);
    }

    @Delete('byProduct/:productId')
    async deleteByProductId(
        @Param('productId') productId: string,
    ): Promise<void> {
        await this.reviewService.deleteByProductId(productId);
    }
}
