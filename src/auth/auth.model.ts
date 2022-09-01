import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = AuthModel & Document;

@Schema({ timestamps: true })
export class AuthModel {
    @Prop({
        unique: true,
        required: true,
    })
    email: string;

    @Prop({
        required: true,
    })
    password: string;
}

export const AuthSchema = SchemaFactory.createForClass(AuthModel);
