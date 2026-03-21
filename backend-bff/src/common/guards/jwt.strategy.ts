import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtUser } from '../../stocks/types/jwtUser.type';

// Extracts the JWT from the Authorization header,
// verifies the token signature using the shared secret,
// checks that iss and aud in the token match these expected values,
// and rejects expired tokens.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'ThisIsMySuperSecretJwtKey1234567890',
      issuer: 'TradeWebAPI',
      audience: 'TradeWebAPIUsers',
    });
  }

  validate(payload: JwtUser): JwtUser {
    return payload;
  }
}
