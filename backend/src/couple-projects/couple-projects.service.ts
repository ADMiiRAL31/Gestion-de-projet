import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoupleProjectDto } from './dto/create-couple-project.dto';
import { UpdateCoupleProjectDto } from './dto/update-couple-project.dto';
import { CreateContributionDto } from './dto/create-contribution.dto';

@Injectable()
export class CoupleProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createCoupleProjectDto: CreateCoupleProjectDto) {
    return this.prisma.coupleProject.create({
      data: createCoupleProjectDto,
      include: {
        contributions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.coupleProject.findMany({
      include: {
        contributions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            contributions: true,
          },
        },
      },
      orderBy: {
        targetDate: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.coupleProject.findUnique({
      where: { id },
      include: {
        contributions: {
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
            date: 'desc',
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Couple project with ID ${id} not found`);
    }

    // Calculate total contributions
    const totalContributions = project.contributions.reduce(
      (sum, contribution) => sum + contribution.amount,
      0,
    );

    // Calculate completion percentage
    const completionPercentage =
      project.targetAmount > 0
        ? Math.min((totalContributions / project.targetAmount) * 100, 100)
        : 0;

    return {
      ...project,
      totalContributions,
      completionPercentage: Math.round(completionPercentage * 100) / 100,
    };
  }

  async update(id: string, updateCoupleProjectDto: UpdateCoupleProjectDto) {
    const project = await this.findOne(id);

    return this.prisma.coupleProject.update({
      where: { id },
      data: updateCoupleProjectDto,
      include: {
        contributions: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    const project = await this.findOne(id);

    return this.prisma.coupleProject.delete({
      where: { id },
    });
  }

  // Contribution management
  async addContribution(createContributionDto: CreateContributionDto) {
    const { projectId } = createContributionDto;

    // Verify project exists
    await this.findOne(projectId);

    return this.prisma.projectContribution.create({
      data: createContributionDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            email: true,
          },
        },
        project: true,
      },
    });
  }

  async getContributions(projectId: string) {
    return this.prisma.projectContribution.findMany({
      where: { projectId },
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
        date: 'desc',
      },
    });
  }

  async deleteContribution(contributionId: string) {
    return this.prisma.projectContribution.delete({
      where: { id: contributionId },
    });
  }
}
