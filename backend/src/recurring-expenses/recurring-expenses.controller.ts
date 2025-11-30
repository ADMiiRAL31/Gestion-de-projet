import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { RecurringExpensesService } from './recurring-expenses.service';
import { CreateRecurringExpenseDto } from './dto/create-recurring-expense.dto';
import { UpdateRecurringExpenseDto } from './dto/update-recurring-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recurring-expenses')
@UseGuards(JwtAuthGuard)
export class RecurringExpensesController {
  constructor(private recurringExpensesService: RecurringExpensesService) {}

  @Post()
  create(@Body() createRecurringExpenseDto: CreateRecurringExpenseDto) {
    return this.recurringExpensesService.create(createRecurringExpenseDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.recurringExpensesService.findByUser(userId);
    }
    return this.recurringExpensesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recurringExpensesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecurringExpenseDto: UpdateRecurringExpenseDto) {
    return this.recurringExpensesService.update(id, updateRecurringExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recurringExpensesService.remove(id);
  }
}
