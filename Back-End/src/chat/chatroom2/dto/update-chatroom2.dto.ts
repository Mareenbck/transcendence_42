import { PartialType } from '@nestjs/mapped-types';
import { CreateChatroomDto } from './create-chatroom2.dto';

export class UpdateChatroomDto extends PartialType(CreateChatroomDto) {}
