import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  // App Configuration
  get port(): number {
    return this.configService.get<number>('app.port') ?? 3000;
  }

  get environment(): string {
    return this.configService.get<string>('app.environment') ?? 'development';
  }

  get apiPrefix(): string {
    return this.configService.get<string>('app.apiPrefix') ?? '/api';
  }

  get corsOrigin(): string {
    return this.configService.get<string>('app.corsOrigin') ?? '*';
  }

  get isDevelopment(): boolean {
    return this.environment === 'development';
  }

  get isProduction(): boolean {
    return this.environment === 'production';
  }

  // Database Configuration
  get databaseConfig() {
    return {
      type: this.configService.get<'mongodb'>('database.type'),
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      authSource: this.configService.get<string>('database.authSource'),
      synchronize: this.configService.get<boolean>('database.synchronize'),
      logging: this.configService.get<boolean>('database.logging'),
    };
  }
}