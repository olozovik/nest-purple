import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
    @IsEmail()
    login: string;

    @MinLength(5)
    @IsString()
    password: string;
}
