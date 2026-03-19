import { IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: '아이디를 입력해 주세요' })
  @MinLength(1, { message: '아이디를 입력해 주세요' })
  @MaxLength(255)
  email: string;

  @IsString()
  password: string;
}
