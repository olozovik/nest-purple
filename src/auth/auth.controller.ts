import { Body, Controller, HttpCode, Injectable, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthDocument, AuthModel } from './auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
@Controller('auth')
export class AuthController {
    constructor(
        @InjectModel(AuthModel.name)
        private readonly authSchema: Model<AuthDocument>,
    ) {}
    @Post('register')
    async register(@Body() dto: AuthDto) {
        const newUser = new this.authSchema(dto);
        return await newUser.save();
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: AuthDto) {}
}
