import { BadRequestException, Body, Controller, Get, HttpStatus, InternalServerErrorException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CSVDTO } from './core/dtos/csv.validator.dto';

@ApiBearerAuth()
@Controller('files')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiOperation({ summary: 'Upload CSV file Endpoint' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {  type: 'object', properties: { file: { type: 'string', format: 'binary' } }},
  })
  @Post('/upload-file')
  @UseInterceptors(
    FileInterceptor('file', { storage: memoryStorage(),
      limits: { files: 1, fileSize: 1024 * 1024 * 5 }, // 1 MB you can adjust size here
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['text/csv'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(new BadRequestException('Invalid file type'), false);
        } else if (file?.size > 1024 * 1024 * 5) { // 1MB
          cb(
            new BadRequestException('Max File Size Reached. Max Allowed: 1MB'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadCsvFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<any> {
    try {
      let response: any = await this.appService.validateCsvData(file)
      if (!response.error) {
        response = await this.appService.processFile(file);
      }
      return {
        error: false,
        statusCode: response?.status || HttpStatus.OK,
        message: response?.message || "file uploaded successfully",
        data: response?.data || [],
        errorsArray: response?.errorsArray || []
      };
    } catch (e) {
      throw new InternalServerErrorException(e?.message || "Internal Server Error")
    }
  }
}
 

