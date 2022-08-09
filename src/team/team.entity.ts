import { Table } from 'src/table/table.entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Team {
  @PrimaryColumn('varchar', { length: 70, unique: true })
  teamName: string;

  @Column('text', { array: true })
  players: string[];
}
