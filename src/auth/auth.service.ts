import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserDocument, UserModel } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { USER_NOT_FOUND, WRONG_PASSWORD } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.name)
        private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) {}

    async createUser(dto: AuthDto): Promise<UserDocument | null> {
        const isUserExist = await this.findUser(dto.email);
        if (isUserExist) {
            return null;
        }
        const passwordHash = await hash(dto.password, 10);
        const newUser = new this.userModel({
            email: dto.email,
            password: passwordHash,
        });
        return await this.userModel.create(newUser);
    }

    async findUser(email: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ email }).exec();
    }

    async validateUser(
        email: string,
        password: string,
    ): Promise<Pick<UserDocument, 'email'>> {
        const user = await this.findUser(email);
        if (!user) {
            throw new UnauthorizedException(USER_NOT_FOUND);
        }
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new UnauthorizedException(WRONG_PASSWORD);
        }
        return { email: user.email };
    }

    async login(email: string): Promise<{ access_token: string }> {
        const payload = { email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
