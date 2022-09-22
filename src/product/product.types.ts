import { ProductDocument } from './product.model';
import { ReviewDocument } from '../review/review.model';

export interface IProductWithReviews extends ProductDocument {
    reviews: ReviewDocument[];
    reviewsCount: number;
    reviewsAvg: number;
}
