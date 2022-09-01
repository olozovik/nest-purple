import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class ProductCharacteristics {
    @Prop()
    name: string;

    @Prop()
    value: string;
}

export type ProductDocument = ProductModel & Document;

Schema({ timestamps: true });
export class ProductModel {
    @Prop()
    image: string;

    @Prop()
    title: string;

    @Prop()
    price: number;

    @Prop()
    oldPrice: number;

    @Prop()
    credit: number;

    @Prop()
    calculatedRating: number;

    @Prop()
    description: string;

    @Prop()
    advantages: string;

    @Prop()
    disadvantages: string;

    @Prop()
    categories: string[];

    @Prop([String])
    tags: string[];

    @Prop({ type: [ProductCharacteristics], _id: false })
    characteristics: ProductCharacteristics[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
