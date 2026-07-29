import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateManagerDto } from './create-manager.dto';

export class UpdateManagerDto extends PartialType(
    OmitType(CreateManagerDto,['userId'] as const)
) {}
