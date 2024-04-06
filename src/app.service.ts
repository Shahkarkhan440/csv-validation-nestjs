import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CSVDTO } from './core/dtos/csv.validator.dto';
import * as csv from 'csv-parse';

@Injectable()
export class AppService {
  
  async validateCsvData(file): Promise<any> {
    const csvContent = file.buffer
    const parsedData: any = await new Promise((resolve, reject) => {
      csv.parse(csvContent, { columns: true, relax_quotes: true, skip_empty_lines: true, cast: true }, (err, records) => {
        if (err) {
          reject(err);
          return { error: true, message: "Unable to parse file" }
        }
        resolve(records);
      });
    });
    const errors: string[] = [];
    if (!parsedData.length) {
      errors.push('Empty File Provided')
      return { error: true, message: "File Validation Failed", errorsArray: errors }
    }
    //validate All Rows
    for await (const [index, rowData] of parsedData.entries()) {
      const validationErrors = await this.validateFileRow(rowData)
      if (validationErrors.length) {
        return { error: true, message: `File Rows Validation Failed at row: ${index + 1}`, errorsArray: validationErrors }
      }
    }
    return { error: false };
  }
  
  async validateFileRow(rowData) {
    const errors: string[] = [];
    const csvDto = plainToInstance(CSVDTO, rowData);
    const validationErrors = await validate(csvDto);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        const { property, constraints } = error;
        const errorMessage = `${property}: ${Object.values(constraints).join(', ')}`;
        errors.push(errorMessage);
      });
    }
    return errors
  }

  async processFile(file){
    return {message: "file validation successfully done. you can do your processing with your validated file data"}
  }


}
