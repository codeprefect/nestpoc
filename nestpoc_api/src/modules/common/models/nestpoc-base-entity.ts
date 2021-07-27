import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class NestPocTrackedEntity extends BaseEntity {
  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated?: Date;

  @VersionColumn()
  public version: number;
}

export abstract class NestPocBaseEntity extends NestPocTrackedEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
}
