export enum TopLevelCategory {
    Courses,
    Services,
    Books,
    Products,
}
import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TopPageDocument = TopPageModel & Document;

@Schema({ timestamps: true })
export class TopPageModel {
    @Prop()
    firstCategory: TopLevelCategory;

    @Prop()
    secondCategory: string;

    @Prop()
    title: string;

    @Prop()
    category: string;

    @Prop({ type: Object })
    hh?: {
        count: number;
        juniorSalary: number;
        middleSalary: number;
        seniorSalary: number;
    };

    @Prop({ type: Object })
    advantages: {
        title: string;
        description: string;
    }[];

    @Prop()
    seoText: string;

    @Prop()
    tagsTitle: string;

    @Prop()
    tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);
