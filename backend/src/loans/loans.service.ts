import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async create(createLoanDto: CreateLoanDto) {
    return this.prisma.loan.create({
      data: {
        userId: createLoanDto.userId || null,
        isShared: createLoanDto.isShared ?? false,
        label: createLoanDto.label,
        totalAmount: createLoanDto.totalAmount,
        remainingAmount: createLoanDto.remainingAmount,
        monthlyPayment: createLoanDto.monthlyPayment,
        interestRate: createLoanDto.interestRate,
        startDate: new Date(createLoanDto.startDate),
        endDate: new Date(createLoanDto.endDate),
        lender: createLoanDto.lender,
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

    return this.prisma.loan.findMany({
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
      throw new NotFoundException('Loan not found');
    }

    return loan;
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    const data: any = {};

    if (updateLoanDto.userId !== undefined)
      data.userId = updateLoanDto.userId || null;
    if (updateLoanDto.isShared !== undefined)
      data.isShared = updateLoanDto.isShared;
    if (updateLoanDto.label) data.label = updateLoanDto.label;
    if (updateLoanDto.totalAmount !== undefined)
      data.totalAmount = updateLoanDto.totalAmount;
    if (updateLoanDto.remainingAmount !== undefined)
      data.remainingAmount = updateLoanDto.remainingAmount;
    if (updateLoanDto.monthlyPayment !== undefined)
      data.monthlyPayment = updateLoanDto.monthlyPayment;
    if (updateLoanDto.interestRate !== undefined)
      data.interestRate = updateLoanDto.interestRate;
    if (updateLoanDto.startDate)
      data.startDate = new Date(updateLoanDto.startDate);
    if (updateLoanDto.endDate) data.endDate = new Date(updateLoanDto.endDate);
    if (updateLoanDto.lender) data.lender = updateLoanDto.lender;

    return this.prisma.loan.update({
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
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    await this.prisma.loan.delete({
      where: { id },
    });

    return { message: 'Loan deleted successfully' };
  }
}
