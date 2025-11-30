import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async create(createLoanDto: CreateLoanDto) {
    return this.prisma.loan.create({
      data: createLoanDto,
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
    return this.prisma.loan.findMany({
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
    const loan = await this.prisma.loan.findUnique({
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

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    return loan;
  }

  async findByUser(userId: string) {
    return this.prisma.loan.findMany({
      where: { userId },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    const loan = await this.findOne(id);

    return this.prisma.loan.update({
      where: { id },
      data: updateLoanDto,
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
    const loan = await this.findOne(id);

    return this.prisma.loan.delete({
      where: { id },
    });
  }
}
