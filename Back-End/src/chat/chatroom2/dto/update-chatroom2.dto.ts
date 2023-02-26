import { PartialType } from '@nestjs/mapped-types';
import { CreateChatroom2Dto } from './create-chatroom2.dto';

export class UpdateChatroom2Dto extends PartialType(CreateChatroom2Dto) {}
