import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async create(createBudgetDto: CreateBudgetDto) {
    // Vérifier si un budget existe déjà pour cette catégorie/mois/année
    const existing = await this.prisma.budget.findUnique({
      where: {
        userId_category_month_year: {
          userId: createBudgetDto.userId,
          category: createBudgetDto.category,
          month: createBudgetDto.month,
          year: createBudgetDto.year,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Un budget existe déjà pour la catégorie "${createBudgetDto.category}" pour ${createBudgetDto.month}/${createBudgetDto.year}`
      );
    }

    return this.prisma.budget.create({
      data: createBudgetDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string, month?: number, year?: number) {
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (month) {
      where.month = month;
    }

    if (year) {
      where.year = year;
    }

    return this.prisma.budget.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
          },
        },
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { category: 'asc' },
      ],
    });
  }

  async findByUserAndMonth(userId: string, month: number, year: number) {
    return this.prisma.budget.findMany({
      where: {
        userId,
        month,
        year,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
          },
        },
      },
      orderBy: {
        category: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
          },
        },
      },
    });

    if (!budget) {
      throw new NotFoundException(`Budget avec l'ID ${id} non trouvé`);
    }

    return budget;
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto) {
    await this.findOne(id);

    return this.prisma.budget.update({
      where: { id },
      data: updateBudgetDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
          },
        },
      },
    });
  }

  async updateSpent(id: string, spent: number) {
    await this.findOne(id);

    return this.prisma.budget.update({
      where: { id },
      data: { spent },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.budget.delete({
      where: { id },
    });
  }

  // Méthode utilitaire pour obtenir les statistiques de budget
  async getBudgetStats(userId: string, month: number, year: number) {
    const budgets = await this.findByUserAndMonth(userId, month, year);

    const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const remaining = totalBudget - totalSpent;

    return {
      budgets,
      totalBudget,
      totalSpent,
      remaining,
      percentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
    };
  }
}
