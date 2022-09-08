import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { USER_EXISTS_ALREADY } from './auth.constants';
import { UserDocument } from './user.model';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: AuthDto): Promise<UserDocument> {
        const user = await this.authService.createUser(dto);
        if (!user) {
            throw new BadRequestException(USER_EXISTS_ALREADY);
        }
        return user;
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: AuthDto) {}
}
