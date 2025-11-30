import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  async create(createIncomeDto: CreateIncomeDto) {
    return this.prisma.income.create({
      data: {
        userId: createIncomeDto.userId,
        type: createIncomeDto.type,
        label: createIncomeDto.label,
        amount: createIncomeDto.amount,
        currency: createIncomeDto.currency || 'MAD',
        startDate: new Date(createIncomeDto.startDate),
        endDate: createIncomeDto.endDate
          ? new Date(createIncomeDto.endDate)
          : null,
        isRecurring: createIncomeDto.isRecurring ?? true,
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

  async findAll(userId?: string) {
    const where = userId ? { userId } : {};

    return this.prisma.income.findMany({
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
    const income = await this.prisma.income.findUnique({
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

    if (!income) {
      throw new NotFoundException('Income not found');
    }

    return income;
  }

  async update(id: string, updateIncomeDto: UpdateIncomeDto) {
    const income = await this.prisma.income.findUnique({
      where: { id },
    });

    if (!income) {
      throw new NotFoundException('Income not found');
    }

    const data: any = {};

    if (updateIncomeDto.userId) data.userId = updateIncomeDto.userId;
    if (updateIncomeDto.type) data.type = updateIncomeDto.type;
    if (updateIncomeDto.label) data.label = updateIncomeDto.label;
    if (updateIncomeDto.amount !== undefined)
      data.amount = updateIncomeDto.amount;
    if (updateIncomeDto.currency) data.currency = updateIncomeDto.currency;
    if (updateIncomeDto.startDate)
      data.startDate = new Date(updateIncomeDto.startDate);
    if (updateIncomeDto.endDate !== undefined) {
      data.endDate = updateIncomeDto.endDate
        ? new Date(updateIncomeDto.endDate)
        : null;
    }
    if (updateIncomeDto.isRecurring !== undefined)
      data.isRecurring = updateIncomeDto.isRecurring;

    return this.prisma.income.update({
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
    const income = await this.prisma.income.findUnique({
      where: { id },
    });

    if (!income) {
      throw new NotFoundException('Income not found');
    }

    await this.prisma.income.delete({
      where: { id },
    });

    return { message: 'Income deleted successfully' };
  }
}
