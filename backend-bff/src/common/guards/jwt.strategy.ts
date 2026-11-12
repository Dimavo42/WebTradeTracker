import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtUser } from '../types/jwtUser.type';

interface DotnetJwtPayload {
  nameid: string;
  email: string;
  role: string;
}

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

  // .NET writes ClaimTypes.NameIdentifier/Email/Role into the JWT as "nameid", "email", "role".
  // Map them to our own JwtUser shape (there is no "userId" claim in the token).
  validate(payload: DotnetJwtPayload): JwtUser {
    return {
      userId: Number(payload.nameid),
      email: payload.email,
      role: payload.role,
    };
  }
}
