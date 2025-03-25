import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742884309140 implements MigrationInterface {
    name = 'Migration1742884309140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "thumbnailUrl" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "thumbnailUrl" SET NOT NULL`);
    }

}
