import { MigrationInterface, QueryRunner } from 'typeorm';

export class initializeDb1627343284578 implements MigrationInterface {
  name = 'initializeDb1627343284578';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('auth_schema', true);
    await queryRunner.query(
      `CREATE TABLE "auth_schema"."user" ("created" datetime2 NOT NULL CONSTRAINT "DF_df70d4ee4fc9332104241979901" DEFAULT getdate(), "updated" datetime2 NOT NULL CONSTRAINT "DF_e69ff91ea36cf2fe813bfdd96a8" DEFAULT getdate(), "version" int NOT NULL, "id" uniqueidentifier NOT NULL CONSTRAINT "DF_72ee70fe54144c24f6880d0c6a0" DEFAULT NEWSEQUENTIALID(), "username" varchar(30) NOT NULL, "email" varchar(100) NOT NULL, "hashedPassword" varchar(255) NOT NULL, "twoFASecret" nvarchar(255), "temp2FASecret" nvarchar(255), CONSTRAINT "UQ_b87a45300b932446e90695f87e7" UNIQUE ("username"), CONSTRAINT "UQ_89f70f0dbb38c9929fdd73b7bfc" UNIQUE ("email"), CONSTRAINT "PK_72ee70fe54144c24f6880d0c6a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth_schema"."personal_info" ("created" datetime2 NOT NULL CONSTRAINT "DF_f806362c2a4930b75d0285f96ef" DEFAULT getdate(), "updated" datetime2 NOT NULL CONSTRAINT "DF_2276f2baa9ed438122924311181" DEFAULT getdate(), "version" int NOT NULL, "firstName" varchar(30) NOT NULL, "lastName" varchar(30) NOT NULL, "dateOfBirth" datetime NOT NULL, "countryCode" varchar(4) NOT NULL, "phoneNumber" varchar(20) NOT NULL, "profileId" uniqueidentifier NOT NULL, CONSTRAINT "PK_2a64542334dc3539dfb59945eeb" PRIMARY KEY ("profileId"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_2a64542334dc3539dfb59945ee" ON "auth_schema"."personal_info" ("profileId") WHERE "profileId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_schema"."personal_info" ADD CONSTRAINT "FK_2a64542334dc3539dfb59945eeb" FOREIGN KEY ("profileId") REFERENCES "auth_schema"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_schema"."personal_info" DROP CONSTRAINT "FK_2a64542334dc3539dfb59945eeb"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_2a64542334dc3539dfb59945ee" ON "auth_schema"."personal_info"`,
    );
    await queryRunner.query(`DROP TABLE "auth_schema"."personal_info"`);
    await queryRunner.query(`DROP TABLE "auth_schema"."user"`);
  }
}
