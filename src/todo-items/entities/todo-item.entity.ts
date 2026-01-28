import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('todo') // Tabellenname klein geschrieben
export class TodoItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 }) // max 50 Zeichen
  title: string;

  @Column({ nullable: true }) // kann leer sein
  description: string;

  @Column({ name: 'is_closed', default: false }) // Feldname mit _
  isClosed: boolean;

  @CreateDateColumn({ name: 'created_at' }) // Pflicht laut Liste
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // Pflicht laut Liste
  updatedAt: Date;

  @Column({ name: 'created_by_id' }) // Verknüpfung zum User
  createdById: number;

  @Column({ name: 'updated_by_id', nullable: true })
  updatedById: number;

  @VersionColumn() // Pflicht laut Liste
  version: number;
}
