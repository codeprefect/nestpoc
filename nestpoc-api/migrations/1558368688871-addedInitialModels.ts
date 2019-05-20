import {MigrationInterface, QueryRunner} from "typeorm";

export class addedInitialModels1558368688871 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "auth_schema"."user" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(30) NOT NULL, "email" character varying(100) NOT NULL, "hashedPassword" character varying NOT NULL, "twoFASecret" character varying, "temp2FASecret" character varying, CONSTRAINT "UQ_b87a45300b932446e90695f87e7" UNIQUE ("username"), CONSTRAINT "UQ_89f70f0dbb38c9929fdd73b7bfc" UNIQUE ("email"), CONSTRAINT "PK_72ee70fe54144c24f6880d0c6a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_schema"."personal_info" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "firstName" character varying(30) NOT NULL, "lastName" character varying(30) NOT NULL, "dateOfBirth" TIMESTAMP NOT NULL, "countryCode" character varying(4) NOT NULL, "phoneNumber" character varying(20) NOT NULL, "profileId" uuid NOT NULL, CONSTRAINT "REL_2a64542334dc3539dfb59945ee" UNIQUE ("profileId"), CONSTRAINT "PK_2a64542334dc3539dfb59945eeb" PRIMARY KEY ("profileId"))`);
        await queryRunner.query(`ALTER TABLE "auth_schema"."personal_info" ADD CONSTRAINT "FK_2a64542334dc3539dfb59945eeb" FOREIGN KEY ("profileId") REFERENCES "auth_schema"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "auth_schema"."personal_info" DROP CONSTRAINT "FK_2a64542334dc3539dfb59945eeb"`);
        await queryRunner.query(`DROP TABLE "auth_schema"."personal_info"`);
        await queryRunner.query(`DROP TABLE "auth_schema"."user"`);
    }

}
