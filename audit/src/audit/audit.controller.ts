import { Controller, Get, Param } from '@nestjs/common';
import {
  EventPattern,
  KafkaRetriableException,
  Payload,
} from '@nestjs/microservices';
import { AuditService } from './audit.service';
import type { AuditRecord } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @EventPattern('trades')
  handleTradeEvent(@Payload() tradeEvent: AuditRecord): void {
    try {
      this.auditService.logEvent(tradeEvent);
    } catch (e) {
      console.error('Error logging trade event:', e);
      throw new KafkaRetriableException('Failed to log trade event');
    }
  }

  @Get('events')
  getAllEvents(): AuditRecord[] {
    return this.auditService.findAll();
  }

  @Get(':action')
  getEventsByAction(@Param('action') action: string): AuditRecord[] {
    return this.auditService.findByAction(action);
  }
}
