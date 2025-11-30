import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Post()
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loansService.create(createLoanDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.loansService.findByUser(userId);
    }
    return this.loansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loansService.update(id, updateLoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loansService.remove(id);
  }
}
