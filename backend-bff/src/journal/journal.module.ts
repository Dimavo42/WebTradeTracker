import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { JwtStrategy } from '../common/guards/jwt.strategy';

@Module({
  imports: [HttpModule],
  controllers: [JournalController],
  providers: [JournalService, JwtStrategy],
})
export class JournalModule {}
