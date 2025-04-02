import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742963308799 implements MigrationInterface {
  name = 'Migration1742963308799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "FK_15b9fc08873ef53ffdb348086ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "FK_77006d7580f807db59887bca894"`,
    );
    await queryRunner.query(`ALTER TABLE "code" DROP COLUMN "expiredAt"`);
    await queryRunner.query(`ALTER TABLE "code" DROP COLUMN "isUsed"`);
    await queryRunner.query(`ALTER TABLE "follower" DROP COLUMN "followedId"`);
    await queryRunner.query(`ALTER TABLE "follower" DROP COLUMN "followingId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isVerified"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "isPrivate"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "imageUrl"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "thumbnailUrl"`);
    await queryRunner.query(
      `ALTER TABLE "code" ADD "expired_at" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "code" ADD "is_used" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "follower" ADD "followed_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "follower" ADD "following_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "first_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "last_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_verified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "post" ADD "updated_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "is_private" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "image_url" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "thumbnail_url" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "FK_d2c4468e1264a8169609be8ac59" FOREIGN KEY ("followed_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "FK_07301dde24966bb953f6749780d" FOREIGN KEY ("following_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "FK_07301dde24966bb953f6749780d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "FK_d2c4468e1264a8169609be8ac59"`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "thumbnail_url"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "image_url"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "is_private"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_verified"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`);
    await queryRunner.query(
      `ALTER TABLE "follower" DROP COLUMN "following_id"`,
    );
    await queryRunner.query(`ALTER TABLE "follower" DROP COLUMN "followed_id"`);
    await queryRunner.query(`ALTER TABLE "code" DROP COLUMN "is_used"`);
    await queryRunner.query(`ALTER TABLE "code" DROP COLUMN "expired_at"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "thumbnailUrl" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "imageUrl" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "isPrivate" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "post" ADD "updatedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isVerified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "firstName" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "follower" ADD "followingId" integer`);
    await queryRunner.query(`ALTER TABLE "follower" ADD "followedId" integer`);
    await queryRunner.query(
      `ALTER TABLE "code" ADD "isUsed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "code" ADD "expiredAt" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "FK_77006d7580f807db59887bca894" FOREIGN KEY ("followedId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "FK_15b9fc08873ef53ffdb348086ed" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
