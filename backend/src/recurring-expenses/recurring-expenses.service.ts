import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecurringExpenseDto } from './dto/create-recurring-expense.dto';
import { UpdateRecurringExpenseDto } from './dto/update-recurring-expense.dto';

@Injectable()
export class RecurringExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(createRecurringExpenseDto: CreateRecurringExpenseDto) {
    return this.prisma.recurringExpense.create({
      data: createRecurringExpenseDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.recurringExpense.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            email: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const expense = await this.prisma.recurringExpense.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            email: true,
          },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException(`Recurring expense with ID ${id} not found`);
    }

    return expense;
  }

  async findByUser(userId: string) {
    return this.prisma.recurringExpense.findMany({
      where: { userId },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async update(id: string, updateRecurringExpenseDto: UpdateRecurringExpenseDto) {
    const expense = await this.findOne(id);

    return this.prisma.recurringExpense.update({
      where: { id },
      data: updateRecurringExpenseDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const expense = await this.findOne(id);

    return this.prisma.recurringExpense.delete({
      where: { id },
    });
  }
}
