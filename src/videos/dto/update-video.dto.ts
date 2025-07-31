import { CreateVideoDto } from './create-video.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateVideoDto extends OmitType(CreateVideoDto, ['id'] as const) {}
