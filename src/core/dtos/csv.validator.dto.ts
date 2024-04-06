import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateIf } from "class-validator";
enum educationTypesEnum{
    COLLEGE='college',
    UNIVERSITY='university'
}

export class CSVDTO{
    @IsNotEmpty()
    @IsString()
    name: string
    
    @IsNumber()
    @IsNotEmpty()
    @Min(12)
    age: number

    @IsNotEmpty()
    @IsString()
    @IsEnum(educationTypesEnum)
    educationLevel: string

    @ValidateIf(item=> item.education== educationTypesEnum.COLLEGE)
    @IsNumber()
    @IsNotEmpty()
    marks: number

    @ValidateIf(item=> item.education== educationTypesEnum.UNIVERSITY)
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    cgpa: number
}