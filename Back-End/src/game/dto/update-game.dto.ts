import { PartialType } from '@nestjs/mapped-types';
import { CreateJeuDto } from './create-game.dto';

export class UpdateJeuDto extends PartialType(CreateJeuDto) {}
