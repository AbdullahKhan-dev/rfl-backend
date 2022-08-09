import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamNameDto } from './dto/team-name.dto';
import { UpdatePlayersDto } from './dto/update-players.dto';
import { Team } from './team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  private maxPlayersPerTeam = 10;
  private minPlayersPerTeam = 2;

  async getAllTeams(): Promise<Team[]> {
    return await this.teamRepository.find();
  }

  async getTeamByName(teamNameDto: TeamNameDto): Promise<Team> {
    const { teamName } = teamNameDto;
    const found = await this.teamRepository.findOneBy({
      teamName: teamName,
    });
    if (!found) {
      throw new NotFoundException(`Team ${teamName} does not exist`);
    }
    return found;
  }

  async createNewTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    const newTeam = this.teamRepository.create({ ...createTeamDto });

    try {
      await this.teamRepository.save(newTeam);
    } catch (error) {
      throw new ConflictException(`'${createTeamDto.teamName}' already exists`);
    }

    return newTeam;
  }

  async addPlayer(
    teamNameDto: TeamNameDto,
    updatePlayersDto: UpdatePlayersDto,
  ): Promise<Team> {
    const { playerName } = updatePlayersDto;
    const found = await this.getTeamByName(teamNameDto);
    if (found.players.length === this.maxPlayersPerTeam) {
      throw new ForbiddenException('Team is already full');
    }
    found.players.push(playerName);
    await this.teamRepository.save(found);
    return found;
  }

  async removePlayer(
    teamNameDto: TeamNameDto,
    updatePlayersDto: UpdatePlayersDto,
  ): Promise<Team> {
    const { playerName } = updatePlayersDto;
    const found = await this.getTeamByName(teamNameDto);
    if (found.players.length === this.minPlayersPerTeam) {
      throw new ForbiddenException(
        'Team already has minimum number of players',
      );
    }
    const newPlayersList = found.players.filter(
      (player) => player != playerName,
    );
    found.players = newPlayersList;
    await this.teamRepository.save(found);
    return found;
  }

  //   async updateFixtureDetails(
  //     id: number,
  //     fixtureDto: CreateFixtureDto,
  //   ): Promise<Fixture> {
  //     let found = await this.getFixtureById(id);
  //     found = { ...found, ...fixtureDto };
  //     if (!found) {
  //       throw new NotFoundException(`Fixture with id ${id} does not exist`);
  //     }
  //     await this.fixtureRepository.save(found);
  //     return found;
  //   }

  async deleteTeamByName(teamNameDto: TeamNameDto): Promise<string> {
    const found = await this.getTeamByName(teamNameDto);
    await this.teamRepository.delete(found.teamName);
    return `Fixture deleted: ${JSON.stringify(found)}`;
  }
}
