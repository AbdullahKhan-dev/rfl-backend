import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PAGINATION_LIMIT } from 'src/shared/constants';
import { CreateFixtureDto } from './dto/create-fuxture.dto';
import { DateObjectDto } from './dto/date-object.dto';
import { UpdateFixtureDto } from './dto/update-fixture.dto';
import { Fixture } from './fixtures.entity';
import { FixturesService } from './fixtures.service';

@UseGuards(AuthGuard())
@Controller('fixtures')
export class FixturesController {
  constructor(private fixturesService: FixturesService) {}
  // @Get()
  // getAllFixtures(): Promise<Fixture[]> {
  //   return this.fixturesService.getAllFixtures();
  // }

  @Get('')
  async getAllFixtures(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
  ): Promise<Pagination<Fixture>> {
    return this.fixturesService.getAllFixtures({
      page,
      limit: PAGINATION_LIMIT,
      route: '/fixtures',
    });
  }

  @Get('/:id')
  getFixturesById(@Param('id') id: number): Promise<Fixture> {
    return this.fixturesService.getFixtureById(id);
  }

  @Get('/filter/date')
  filterByDate(@Query() date: DateObjectDto): Promise<Fixture[]> {
    return this.fixturesService.filterByDate(date);
  }

  @Patch('/:id')
  updateFixtureDetails(
    @Param('id') id: number,
    @Body() fixtureDto: UpdateFixtureDto,
  ): Promise<Fixture> {
    return this.fixturesService.updateFixtureDetails(id, fixtureDto);
  }

  @Post()
  createNewFixture(
    @Body() createFixtureDto: CreateFixtureDto,
  ): Promise<Fixture> {
    return this.fixturesService.createNewFixture(createFixtureDto);
  }

  @Delete('/:id')
  deleteFixture(@Param('id') id: number) {
    return this.fixturesService.deleteFixture(id);
  }
}
