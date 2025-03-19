import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742371019418 implements MigrationInterface {
  name = 'Migration1742371019418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ADD "isPrivate" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "isPrivate"`);
  }
}
