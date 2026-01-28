import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('user') // Tabellenname klein geschrieben
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 }) // Vorgabe: unique und max 20 Zeichen
  username: string;

  @Column()
  email: string;

  @Column({ name: 'password_hash' }) // OWASP: Passwort verschlüsselt speichern
  passwordHash: string;

  @Column({ name: 'is_admin', default: false }) // Feldname in DB mit Unterstrich
  isAdmin: boolean;

  @CreateDateColumn({ name: 'created_at' }) // Automatische Zeitstempel
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @VersionColumn() // Pflicht für die Bewertung
  version: number;

  @Column({ name: 'created_by_id', nullable: true }) // Mapping für DB-Konformität
  createdById: number;

  @Column({ name: 'updated_by_id', nullable: true })
  updatedById: number;
}
