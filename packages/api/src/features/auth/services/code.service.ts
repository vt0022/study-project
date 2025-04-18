import { BadRequestException, Injectable } from '@nestjs/common';
import { Code } from '../entities/code.entity';
import { User } from 'src/features/users/entities/user.entity';
import { UserService } from 'src/features/users/services/user.service';
import { CodeRepository } from '../repositories/code.repository';
import { AppConstants } from 'src/common/constants/app.constant';

@Injectable()
export class CodeService {
  constructor(
    private codeRepository: CodeRepository,
    private userService: UserService,
  ) {}

  async findCodeByUser(user: User): Promise<string> {
    const code = await this.codeRepository.findCodeByUserId(user.id);

    if (code) {
      let codeValue: string;
      do {
        codeValue = Math.floor(100000 + Math.random() * 900000).toString();
      } while (code.value === codeValue);

      code.value = codeValue;

      code.expiredAt = new Date(Date.now() + AppConstants.CODE_EXPIRES_IN);
      code.isUsed = false;
      await this.codeRepository.saveCode(code);

      return code.value;
    } else {
      const newCode = this.createCode(user);
      return (await newCode).value;
    }
  }

  async verifyCode(email: string, value: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const code = await this.codeRepository.findCodeByValueAndUserId(
      value,
      user.id,
    );

    if (!code) {
      throw new BadRequestException('Invalid code');
      //   return VerifyStatus.INVALID_CODE;
    }

    // Code used
    if (code.isUsed) {
      throw new BadRequestException('Code expired');
      //   return VerifyStatus.CODE_EXPIRED;
    } else {
      // Code not used and not expired
      if (code.expiredAt > new Date()) {
        code.isUsed = true;
        await this.codeRepository.saveCode(code);

        user.isVerified = true;
        await this.userService.saveUser(user);

        return user;
      } else {
        throw new BadRequestException('Code expired');
        // return VerifyStatus.CODE_EXPIRED;
      }
    }
  }

  async createCode(user: User): Promise<Code> {
    const code = new Code();
    code.expiredAt = new Date(Date.now() + AppConstants.CODE_EXPIRES_IN);
    code.user = user;

    let codeValue: string;
    do {
      codeValue = Math.floor(100000 + Math.random() * 900000).toString();
    } while (await this.codeRepository.findCodeByValue(codeValue));

    code.value = codeValue;

    return await this.codeRepository.saveCode(code);
  }
}
