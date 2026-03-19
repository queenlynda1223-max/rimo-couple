import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignupDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: '아이디를 입력해 주세요' })
  @MinLength(1, { message: '아이디를 입력해 주세요' })
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
  password: string;

  @IsOptional()
  @IsString()
  nickname?: string;
}
