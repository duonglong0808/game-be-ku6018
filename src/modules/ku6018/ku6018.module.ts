import { Module } from '@nestjs/common';
import { Ku6018Service } from './ku6018.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [Ku6018Service],
  exports: [Ku6018Service],
})
export class Ku6018Module {}
