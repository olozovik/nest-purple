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

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(
        @Body() { email, password }: AuthDto,
    ): Promise<{ access_token: string }> {
        await this.authService.validateUser(email, password);
        return await this.authService.login(email);
    }
}
