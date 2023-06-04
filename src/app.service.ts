import { Injectable } from '@nestjs/common';
import { script } from './scripts';
@Injectable()
export class AppService {
  getHello(): string {
    return script;
  }
}
