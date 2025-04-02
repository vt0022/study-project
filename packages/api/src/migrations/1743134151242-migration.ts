import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1743134151242 implements MigrationInterface {
  name = 'Migration1743134151242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "follower" RENAME COLUMN "followedAt" TO "followed_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "like" RENAME COLUMN "likedAt" TO "liked_at"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "like" RENAME COLUMN "liked_at" TO "likedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" RENAME COLUMN "followed_at" TO "followedAt"`,
    );
  }
}
