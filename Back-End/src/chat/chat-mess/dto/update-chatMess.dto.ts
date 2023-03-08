import { PartialType } from '@nestjs/mapped-types';
import { CreateChatMessDto } from './create-chatMess.dto';

export class UpdateChatMessDto extends PartialType(CreateChatMessDto) {}
