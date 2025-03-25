import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742877734214 implements MigrationInterface {
    name = 'Migration1742877734214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "imageUrl" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ADD "thumbnailUrl" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "thumbnailUrl"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "imageUrl"`);
    }

}
