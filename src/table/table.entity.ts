import { Team } from 'src/team/team.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Table {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => Team, { cascade: true, eager: true })
  @JoinColumn({ name: 'team' })
  team: Team;

  @Column('int', { default: 0 })
  played: number;

  @Column('int', { default: 0 })
  won: number;

  @Column('int', { default: 0 })
  drawn: number;

  @Column('int', { default: 0 })
  lost: number;

  @Column('int', { default: 0 })
  points: number;
}
