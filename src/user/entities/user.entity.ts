import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  TEST = 'test',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  username!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  passwordHash!: string;

  @Column({ type: 'boolean', default: false })
  isAdmin!: boolean;

  @Column({ type: 'varchar', default: UserRole.USER })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @VersionColumn()
  version!: number;

  @Column({ type: 'int' })
  createdById!: number;

  @Column({ type: 'int' })
  updatedById!: number;
}
