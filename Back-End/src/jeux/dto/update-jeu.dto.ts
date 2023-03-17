import { PartialType } from '@nestjs/mapped-types';
import { CreateJeuDto } from './create-jeu.dto';

export class UpdateJeuDto extends PartialType(CreateJeuDto) {}
