import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamService } from 'src/team/team.service';
import { Repository } from 'typeorm';
import { CreateFixtureDto } from './dto/create-fuxture.dto';
import { UpdateFixtureDto } from './dto/update-fixture.dto';
import { Fixture } from './fixtures.entity';
import { DateObjectDto } from './dto/date-object.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
@Injectable()
export class FixturesService {
  constructor(
    @InjectRepository(Fixture)
    private fixtureRepository: Repository<Fixture>,
    private teamService: TeamService,
  ) {}

  async getFixtureById(id: number): Promise<Fixture> {
    const found = await this.fixtureRepository.findOneBy({
      id: id,
    });
    if (!found) {
      throw new NotFoundException(`Fixture number ${id} does not exist`);
    }
    return found;
  }

  async getAllFixtures(
    options: IPaginationOptions,
  ): Promise<Pagination<Fixture>> {
    const queryBuilder = this.fixtureRepository
      .createQueryBuilder('fixture')
      .leftJoinAndSelect('fixture.homeTeam', 'homeTeam')
      .leftJoinAndSelect('fixture.awayTeam', 'awayTeam')
      .orderBy('fixture.id', 'ASC');

    return paginate<Fixture>(queryBuilder, options);
  }

  async createNewFixture(createFixtureDto: CreateFixtureDto): Promise<Fixture> {
    const { homeTeam, awayTeam, date } = createFixtureDto;
    if (homeTeam == awayTeam) {
      throw new BadRequestException('Home and away teams can not be the same');
    }
    try {
      const newFixture = this.fixtureRepository.create({
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        date: date,
        ended: false,
        result: '',
      });

      await this.fixtureRepository.save(newFixture);
      return newFixture;
    } catch (error) {
      if (error.driverError.code === '23503') {
        throw new NotFoundException(error.detail);
      } else {
        throw error;
      }
    }
  }
  async filterByDate(dateDto: DateObjectDto): Promise<Fixture[]> {
    return await this.fixtureRepository.findBy({ date: dateDto.date });
  }

  async updateFixtureDetails(
    id: number,
    fixtureDto: UpdateFixtureDto,
  ): Promise<Fixture> {
    let found = await this.getFixtureById(id);
    found = { ...found, ...fixtureDto, ended: true };
    if (!found) {
      throw new NotFoundException(`Fixture with id ${id} does not exist`);
    }
    await this.fixtureRepository.save(found);
    return found;
  }

  async deleteFixture(id: number): Promise<string> {
    const found = await this.getFixtureById(id);
    await this.fixtureRepository.delete(id);
    return `Fixture deleted: ${JSON.stringify(found)}`;
  }
}
