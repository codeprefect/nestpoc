import {MigrationInterface, QueryRunner} from 'typeorm';
import { services } from '../src/modules/common/config/constants';

export class addNecessarySchemas1555134026445 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        Object.entries(services).map((key)  => {
            queryRunner.createSchema(key[1].schema, true);
        });
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        Object.entries(services).map((key)  => {
            queryRunner.dropSchema(key[1].schema, true, true);
        });
    }

}
