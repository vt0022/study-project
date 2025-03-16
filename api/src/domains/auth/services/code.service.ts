import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Code } from '../entities/code.entity';
import { Repository } from 'typeorm';
import { User } from 'src/domains/users/entities/user.entity';
import { UserService } from 'src/domains/users/services/user.service';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(Code)
    private codeRepository: Repository<Code>,
    private userService: UserService,
  ) {}

  async findCodeByUser(user: User): Promise<string> {
    const code = await this.codeRepository.findOne({
      where: {
        user: { id: user.id },
      },
    });

    if (code) {
      let codeValue: string;
      do {
        codeValue = Math.floor(100000 + Math.random() * 900000).toString();
      } while (code.value === codeValue);

      code.value = codeValue;

      code.createdAt = new Date(Date.now());
      code.expiredAt = new Date(Date.now() + 1000 * 60 * 15);
      code.isExpired = false;
      await this.codeRepository.save(code);

      return code.value;
    } else {
      const newCode = this.createCode(user);
      return (await newCode).value;
    }
  }

  async verifyCode(email: string, value: string): Promise<void> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const code = await this.codeRepository.findOne({
      where: {
        value: value,
        user: { id: user.id },
      },
    });

    if (!code) {
      throw new BadRequestException('Invalid code');
      //   return VerifyStatus.INVALID_CODE;
    }

    // Code used
    if (code.isExpired) {
      throw new BadRequestException('Code expired');
      //   return VerifyStatus.CODE_EXPIRED;
    } else {
      // Code not used and not expired
      if (code.expiredAt > new Date()) {
        code.isExpired = true;
        await this.codeRepository.save(code);

        user.isVerified = true;
        await this.userService.saveUser(user);
      } else {
        throw new BadRequestException('Code expired');
        // return VerifyStatus.CODE_EXPIRED;
      }
    }
  }

  async createCode(user: User): Promise<Code> {
    const code = new Code();
    code.expiredAt = new Date(Date.now() + 1000 * 60 * 5);
    code.user = user;

    let codeValue: string;
    do {
      codeValue = Math.floor(100000 + Math.random() * 900000).toString();
    } while (await this.codeRepository.findOneBy({ value: codeValue }));

    code.value = codeValue;

    return await this.codeRepository.save(code);
  }
}
