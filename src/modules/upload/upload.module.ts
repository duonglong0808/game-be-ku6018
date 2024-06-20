import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { FirebaseService } from 'src/utils';

@Module({
  controllers: [UploadController],
  providers: [UploadService, FirebaseService],
})
export class UploadModule {}
