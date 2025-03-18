import { Repository } from 'typeorm';
import { Code } from '../entities/code.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CodeRepository extends Repository<Code> {
  constructor(
    @InjectRepository(Code)
    private codeRepository: Repository<Code>,
  ) {
    super(codeRepository.target, codeRepository.manager);
  }

  async findCodeByUserId(userId: number): Promise<Code | null> {
    return await this.findOne({
      where: {
        user: { id: userId },
      },
    });
  }

  async findCodeByValue(value: string): Promise<Code | null> {
    return await this.findOne({
      where: {
        value: value,
      },
    });
  }

  async findCodeByValueAndUserId(
    value: string,
    userId: number,
  ): Promise<Code | null> {
    return await this.findOne({
      where: {
        value: value,
        user: { id: userId },
      },
    });
  }

  async saveCode(code: Code): Promise<Code> {
    return await this.save(code);
  }
}
