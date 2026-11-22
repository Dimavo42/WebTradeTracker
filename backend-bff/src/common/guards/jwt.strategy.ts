import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtUser } from '../types/jwtUser.type';
import { ENV } from '../env';

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
      secretOrKey: ENV.JWT_KEY,
      issuer: ENV.JWT_ISSUER,
      audience: ENV.JWT_AUDIENCE,
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
