import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserDocument, UserModel } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async createUser(dto: AuthDto): Promise<UserDocument | null> {
        const isUserExist = await this.findUser(dto.login);
        if (isUserExist) {
            return null;
        }
        const passwordHash = await hash(dto.password, 10);
        const newUser = new this.userModel({
            email: dto.login,
            password: passwordHash,
        });
        return await this.userModel.create(newUser);
    }

    async findUser(email: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ email }).exec();
    }
}
