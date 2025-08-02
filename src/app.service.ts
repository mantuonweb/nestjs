import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  info(): any {
    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
