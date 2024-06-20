import { Controller, Post, UseInterceptors, UploadedFile, HttpException, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalFilesInterceptor, FirebaseService } from 'src/utils';
import { Public } from '../auth/decorators';

// @ApiBearerAuth()
@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Public()
  @Post('image')
  @UseInterceptors(
    LocalFilesInterceptor({
      path: '/images',
      fieldName: 'file',
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() optionUpload: { folder: string }) {
    if (!file) {
      throw new HttpException('file not found', 500);
    }
    const path = await this.firebaseService.uploadImageToStorage(file, optionUpload.folder || 'client');
    return {
      data: path,
    };
  }

  @Public()
  @Post('file')
  @UseInterceptors(
    LocalFilesInterceptor({
      path: '/files',
      fieldName: 'file',
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('file not found', 500);
    }
    const path = await this.firebaseService.uploadFileToStorage(file, 'client');
    return {
      data: path,
    };
  }
}
