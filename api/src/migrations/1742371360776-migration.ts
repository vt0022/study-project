import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742371360776 implements MigrationInterface {
    name = 'Migration1742371360776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "views" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "isPrivate" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "isPrivate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "views" DROP DEFAULT`);
    }

}
