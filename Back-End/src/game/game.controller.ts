import { Controller , Get, Post,} from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    
    @Get()
      getResultat(): string {
        return 'All results';
      }

    @Post()
      create(): string {
        return 'put the result'
      }
  }
  
