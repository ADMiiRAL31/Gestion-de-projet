import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(createBudgetDto);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.budgetsService.findAll(
      userId,
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get('stats')
  getBudgetStats(
    @Query('userId') userId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.budgetsService.getBudgetStats(
      userId,
      parseInt(month),
      parseInt(year),
    );
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.budgetsService.findByUserAndMonth(
      userId,
      parseInt(month),
      parseInt(year),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetsService.update(id, updateBudgetDto);
  }

  @Patch(':id/spent')
  updateSpent(@Param('id') id: string, @Body() body: { spent: number }) {
    return this.budgetsService.updateSpent(id, body.spent);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetsService.remove(id);
  }
}
