import {MigrationInterface, QueryRunner} from "typeorm";

export class allCrazyChanges1558722987736 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "auth_schema"."personal_info" DROP CONSTRAINT "FK_2a64542334dc3539dfb59945eeb"`);
        await queryRunner.query(`ALTER TABLE "auth_schema"."personal_info" ADD CONSTRAINT "UQ_2a64542334dc3539dfb59945eeb" UNIQUE ("profileId")`);
        await queryRunner.query(`ALTER TABLE "auth_schema"."personal_info" ADD CONSTRAINT "FK_2a64542334dc3539dfb59945eeb" FOREIGN KEY ("profileId") REFERENCES "auth_schema"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "auth_schema"."personal_info" DROP CONSTRAINT "FK_2a64542334dc3539dfb59945eeb"`);
        await queryRunner.query(`ALTER TABLE "auth_schema"."personal_info" DROP CONSTRAINT "UQ_2a64542334dc3539dfb59945eeb"`);
        await queryRunner.query(`ALTER TABLE "auth_schema"."personal_info" ADD CONSTRAINT "FK_2a64542334dc3539dfb59945eeb" FOREIGN KEY ("profileId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
