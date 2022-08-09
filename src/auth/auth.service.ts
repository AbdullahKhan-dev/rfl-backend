import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);

    const admin = this.adminRepository.create({
      username: username,
      password: hashedPass,
    });
    try {
      await this.adminRepository.save(admin);
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException(`Admin ${username} already exists`);
      }
    }

    return `User ${username} created successfully`;
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const payload: JwtPayload = { username };
    const found = await this.adminRepository.findOneBy({ username: username });
    console.log(found);
    if (found && (await bcrypt.compare(password, found.password))) {
      const accessToken = this.jwtService.sign({ username });
      return { accessToken };
    } else {
      throw new UnauthorizedException('Incorrect Login Credentials');
    }
  }
}
