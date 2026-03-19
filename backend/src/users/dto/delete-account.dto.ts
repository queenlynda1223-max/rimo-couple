import { IsOptional, IsString, MinLength } from 'class-validator';

/** 비밀번호 가입: password 필수(서비스에서 검증). OAuth 등: confirmation === '회원탈퇴' */
export class DeleteAccountDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  confirmation?: string;
}
