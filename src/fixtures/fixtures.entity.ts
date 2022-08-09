import { Team } from 'src/team/team.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Fixture {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Team, { cascade: true, eager: true })
  @JoinColumn({ name: 'homeTeam' })
  homeTeam: Team['teamName'];

  @ManyToOne(() => Team, { cascade: true, eager: true })
  @JoinColumn({ name: 'awayTeam' })
  awayTeam: Team['teamName'];

  @Column('date')
  date: Date;

  @Column('bool', { default: false })
  ended: boolean;

  @Column('varchar', { default: '' })
  result: string;
}
