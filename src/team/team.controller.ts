import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamNameDto } from './dto/team-name.dto';
import { UpdatePlayersDto } from './dto/update-players.dto';
import { Team } from './team.entity';
import { TeamService } from './team.service';

//@UseGuards(AuthGuard())
@Controller('team')
export class TeamController {
  constructor(private teamsService: TeamService) {}

  @Get()
  getTeams(): Promise<Team[]> {
    return this.teamsService.getAllTeams();
  }

  @Get('/:teamName')
  getTeam(@Param() teamNameDto: TeamNameDto): Promise<Team> {
    return this.teamsService.getTeamByName(teamNameDto);
  }

  @Post()
  createNewTeam(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.createNewTeam(createTeamDto);
  }

  @Delete()
  deleteTeamByName(@Body() teamNameDto: TeamNameDto) {
    return this.teamsService.deleteTeamByName(teamNameDto);
  }

  @Patch('/:teamName/add-player')
  addPlayer(
    @Param() teamNameDto: TeamNameDto,
    @Body() updatePlayersDto: UpdatePlayersDto,
  ): Promise<Team> {
    return this.teamsService.addPlayer(teamNameDto, updatePlayersDto);
  }

  @Patch('/:teamName/remove-player')
  removePlayer(
    @Param() teamNameDto: TeamNameDto,
    @Body() updatePlayersDto: UpdatePlayersDto,
  ): Promise<Team> {
    return this.teamsService.removePlayer(teamNameDto, updatePlayersDto);
  }
}
