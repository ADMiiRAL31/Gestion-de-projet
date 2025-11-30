import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto) {
    return this.prisma.recurringExpense.create({
      data: {
        userId: createExpenseDto.userId || null,
        isShared: createExpenseDto.isShared ?? false,
        category: createExpenseDto.category,
        label: createExpenseDto.label,
        amount: createExpenseDto.amount,
        currency: createExpenseDto.currency || 'MAD',
        billingPeriod: createExpenseDto.billingPeriod || 'MONTHLY',
        startDate: new Date(createExpenseDto.startDate),
        endDate: createExpenseDto.endDate
          ? new Date(createExpenseDto.endDate)
          : null,
        provider: createExpenseDto.provider || null,
      },
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

  async findAll(userId?: string, includeShared?: boolean) {
    const where: any = {};

    if (userId) {
      if (includeShared) {
        where.OR = [{ userId }, { isShared: true }];
      } else {
        where.userId = userId;
      }
    }

    return this.prisma.recurringExpense.findMany({
      where,
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
        createdAt: 'desc',
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
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.prisma.recurringExpense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    const data: any = {};

    if (updateExpenseDto.userId !== undefined)
      data.userId = updateExpenseDto.userId || null;
    if (updateExpenseDto.isShared !== undefined)
      data.isShared = updateExpenseDto.isShared;
    if (updateExpenseDto.category) data.category = updateExpenseDto.category;
    if (updateExpenseDto.label) data.label = updateExpenseDto.label;
    if (updateExpenseDto.amount !== undefined)
      data.amount = updateExpenseDto.amount;
    if (updateExpenseDto.currency) data.currency = updateExpenseDto.currency;
    if (updateExpenseDto.billingPeriod)
      data.billingPeriod = updateExpenseDto.billingPeriod;
    if (updateExpenseDto.startDate)
      data.startDate = new Date(updateExpenseDto.startDate);
    if (updateExpenseDto.endDate !== undefined) {
      data.endDate = updateExpenseDto.endDate
        ? new Date(updateExpenseDto.endDate)
        : null;
    }
    if (updateExpenseDto.provider !== undefined)
      data.provider = updateExpenseDto.provider || null;

    return this.prisma.recurringExpense.update({
      where: { id },
      data,
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
    const expense = await this.prisma.recurringExpense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await this.prisma.recurringExpense.delete({
      where: { id },
    });

    return { message: 'Expense deleted successfully' };
  }
}
