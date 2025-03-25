import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742897834518 implements MigrationInterface {
    name = 'Migration1742897834518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follower" DROP CONSTRAINT "FK_b100536f62259b7aa3733175e53"`);
        await queryRunner.query(`ALTER TABLE "follower" RENAME COLUMN "followerId" TO "followedId"`);
        await queryRunner.query(`ALTER TABLE "follower" ADD CONSTRAINT "FK_77006d7580f807db59887bca894" FOREIGN KEY ("followedId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follower" DROP CONSTRAINT "FK_77006d7580f807db59887bca894"`);
        await queryRunner.query(`ALTER TABLE "follower" RENAME COLUMN "followedId" TO "followerId"`);
        await queryRunner.query(`ALTER TABLE "follower" ADD CONSTRAINT "FK_b100536f62259b7aa3733175e53" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
