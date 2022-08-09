import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateTableEntryDto } from './dto/create-table-entry.dto';
import { TeamNameDto } from './dto/team-name.dto';
import { Table } from './table.entity';
import { TableService } from './table.service';
import { UpdateResultDto } from './dto/update-result.dto';
import { AuthGuard } from '@nestjs/passport';
//@UseGuards(AuthGuard())
@Controller('table')
export class TableController {
  constructor(private tableService: TableService) {}

  @Get()
  getTable(): Promise<Table[]> {
    return this.tableService.getTable();
  }

  @Get('/:teamName')
  getRecordByTeam(@Param() teamNameDto: TeamNameDto): Promise<Table> {
    return this.tableService.getRecordByTeam(teamNameDto);
  }

  @Post()
  createTableEntry(@Body() tableEntryDto: CreateTableEntryDto) {
    return this.tableService.createTableEntry(tableEntryDto);
  }

  @Delete()
  deleteRecordByTeamName(@Body() teamNameDto: TeamNameDto) {
    return this.tableService.deleteRecordByTeamName(teamNameDto);
  }

  @Patch()
  updateResult(@Body() updateResultDto: UpdateResultDto): Promise<Table> {
    return this.tableService.updateResult(updateResultDto);
  }
}
