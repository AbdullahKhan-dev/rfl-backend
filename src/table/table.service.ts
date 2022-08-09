import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamsEnum } from 'src/teams.enum';
import { Repository } from 'typeorm';
import { CreateTableEntryDto } from './dto/create-table-entry.dto';
import { TeamNameDto } from './dto/team-name.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ResultEnum } from './result.enum';
import { Table } from './table.entity';
import { POINTS_PER_WIN, POINTS_PER_DRAW } from '../shared/constants';
import { TeamService } from 'src/team/team.service';
@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    private teamService: TeamService,
  ) {}

  private pointsPerWin = 3;
  private pointsPerDraw = 1;

  async getTable(): Promise<Table[]> {
    return await this.tableRepository.find({
      order: {
        points: 'DESC',
      },
    });
  }

  async createTableEntry(tableEntryDto: CreateTableEntryDto) {
    const { won, drawn, lost } = tableEntryDto;
    const team = await this.teamService.getTeamByName({
      teamName: tableEntryDto.team,
    });
    const entry = this.tableRepository.create({
      ...tableEntryDto,
      team: team,
      played: won * 1 + drawn * 1 + lost * 1,
      points: won * 3 + drawn * 1,
    });
    console.log(entry);

    try {
      await this.tableRepository.save(entry);
    } catch (error) {
      throw new ConflictException(`'${tableEntryDto.team}' already exists`);
    }

    return entry;
  }

  async getRecordByTeam(teamNameDto: TeamNameDto): Promise<Table> {
    const { teamName } = teamNameDto;
    const found = this.tableRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect('table.team', 'team')
      .where('team.teamName = :nameOfTheTeam', { nameOfTheTeam: teamName })
      .getOne();
    if (!found) {
      throw new NotFoundException(`Team ${teamName} does not exist`);
    }
    return found;
  }

  async deleteRecordByTeamName(teamNameDto: TeamNameDto): Promise<string> {
    const found = await this.getRecordByTeam(teamNameDto);
    await this.tableRepository.delete(found.id);
    return `Record deleted: ${JSON.stringify(found)}`;
  }

  async updateResult(updateResultDto: UpdateResultDto): Promise<Table> {
    const { teamName, thisResult } = updateResultDto;
    const found = await this.getRecordByTeam({ teamName: teamName });
    if (!found) {
      throw new NotFoundException(`${teamName} not found.`);
      return;
    }

    found.played += 1;
    if (thisResult == ResultEnum.won) {
      found.won += 1;
      found.points += POINTS_PER_WIN;
    } else if (thisResult == ResultEnum.drawn) {
      found.drawn += 1;
      found.points += POINTS_PER_DRAW;
    } else {
      found.lost += 1;
    }

    await this.tableRepository.save(found);
    return found;
  }
}
