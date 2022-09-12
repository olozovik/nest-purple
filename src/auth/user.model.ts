import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserModel & Document;

@Schema({
    collection: 'users',
    timestamps: true,
})
export class UserModel {
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

export const UserSchema = SchemaFactory.createForClass(UserModel);
