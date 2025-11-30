import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomesService {
  constructor(private prisma: PrismaService) {}

  async create(createIncomeDto: CreateIncomeDto) {
    return this.prisma.income.create({
      data: createIncomeDto,
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
    return this.prisma.income.findMany({
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
      throw new NotFoundException(`Income with ID ${id} not found`);
    }

    return income;
  }

  async findByUser(userId: string) {
    return this.prisma.income.findMany({
      where: { userId },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async update(id: string, updateIncomeDto: UpdateIncomeDto) {
    const income = await this.findOne(id);

    return this.prisma.income.update({
      where: { id },
      data: updateIncomeDto,
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
    const income = await this.findOne(id);

    return this.prisma.income.delete({
      where: { id },
    });
  }
}
