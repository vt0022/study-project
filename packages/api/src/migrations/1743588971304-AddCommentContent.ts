import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentContent1743588971304 implements MigrationInterface {
    name = 'AddCommentContent1743588971304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "content" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "content"`);
    }

}
