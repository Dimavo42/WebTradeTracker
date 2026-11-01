import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { ENV } from '../common/env';

export interface AuditRecord {
  eventId: string;
  action: string;
  entityId: string;
  entityType: string;
  timestamp: string;
  details?: string;
}

@Injectable()
export class AuditService implements OnModuleInit, OnModuleDestroy {
  private db!: Database.Database;
  private insertStmt!: Database.Statement;

  onModuleInit(): void {
    // Initialization logic here
    const dataBasePath = ENV.AUDIT_DB_PATH + '/audit.db';
    mkdirSync(ENV.AUDIT_DB_PATH, { recursive: true });
    this.db = new Database(dataBasePath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = FULL');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit (
        eventId TEXT PRIMARY KEY NOT NULL,
        action TEXT,
        entityId TEXT,
        entityType TEXT,
        timestamp DATETIME,
        details TEXT
      )
    `);
    this.insertStmt = this.db.prepare(`
      INSERT INTO audit (eventId, action, entityId, entityType, timestamp, details)
      VALUES (@eventId, @action, @entityId, @entityType, @timestamp, @details)
      ON CONFLICT(eventId) DO NOTHING
    `);
  }

  onModuleDestroy(): void {
    // Cleanup logic here
    if (this.db) {
      this.db.close();
    }
  }
  logEvent(record: AuditRecord): void {
    try {
      this.insertStmt.run({
        eventId: record.eventId,
        action: record.action,
        entityId: record.entityId,
        entityType: record.entityType,
        timestamp: record.timestamp,
        details: record.details ?? null,
      });
    } catch (error) {
      console.error('Error inserting audit record:', error);
      throw error;
    }
  }

  findAll(): AuditRecord[] {
    try {
      const stmt = this.db.prepare('SELECT * FROM audit');
      return stmt.all() as AuditRecord[];
    } catch (error) {
      console.error('Error fetching audit records:', error);
      throw error;
    }
  }

  findByAction(action: string): AuditRecord[] {
    try {
      const stmt = this.db.prepare('SELECT * FROM audit WHERE action = ?');
      return stmt.all(action) as AuditRecord[];
    } catch (error) {
      console.error('Error fetching audit records by action:', error);
      throw error;
    }
  }
}
