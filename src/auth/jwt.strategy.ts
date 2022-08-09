import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Admin)
    private userRepository: Repository<Admin>,
  ) {
    super({
      secretOrKey: 'mysecret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(load): Promise<Admin> {
    const username = load.username;
    const admin: Admin = await this.userRepository.findOneBy({
      username: username,
    });

    if (!admin) {
      throw new UnauthorizedException();
    } else return admin;
  }
}
