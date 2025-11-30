import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // Project CRUD
  async createProject(createProjectDto: CreateProjectDto) {
    return this.prisma.coupleProject.create({
      data: {
        title: createProjectDto.title,
        description: createProjectDto.description || null,
        targetAmount: createProjectDto.targetAmount,
        currency: createProjectDto.currency || 'MAD',
        targetDate: new Date(createProjectDto.targetDate),
        status: createProjectDto.status || 'IDEA',
        priority: createProjectDto.priority || 'MEDIUM',
      },
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

  async findAllProjects() {
    const projects = await this.prisma.coupleProject.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects.map((project) => this.calculateProjectProgress(project));
  }

  async findOneProject(id: string) {
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
      throw new NotFoundException('Project not found');
    }

    return this.calculateProjectProgress(project);
  }

  async updateProject(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.prisma.coupleProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const data: any = {};

    if (updateProjectDto.title) data.title = updateProjectDto.title;
    if (updateProjectDto.description !== undefined)
      data.description = updateProjectDto.description || null;
    if (updateProjectDto.targetAmount !== undefined)
      data.targetAmount = updateProjectDto.targetAmount;
    if (updateProjectDto.currency) data.currency = updateProjectDto.currency;
    if (updateProjectDto.targetDate)
      data.targetDate = new Date(updateProjectDto.targetDate);
    if (updateProjectDto.status) data.status = updateProjectDto.status;
    if (updateProjectDto.priority) data.priority = updateProjectDto.priority;

    const updated = await this.prisma.coupleProject.update({
      where: { id },
      data,
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

    return this.calculateProjectProgress(updated);
  }

  async removeProject(id: string) {
    const project = await this.prisma.coupleProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.coupleProject.delete({
      where: { id },
    });

    return { message: 'Project deleted successfully' };
  }

  // Contribution CRUD
  async createContribution(createContributionDto: CreateContributionDto) {
    const project = await this.prisma.coupleProject.findUnique({
      where: { id: createContributionDto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.projectContribution.create({
      data: {
        projectId: createContributionDto.projectId,
        userId: createContributionDto.userId,
        amount: createContributionDto.amount,
        date: createContributionDto.date
          ? new Date(createContributionDto.date)
          : new Date(),
        note: createContributionDto.note || null,
      },
      include: {
        project: true,
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

  async findAllContributions(projectId?: string) {
    const where = projectId ? { projectId } : {};

    return this.prisma.projectContribution.findMany({
      where,
      include: {
        project: true,
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

  async findOneContribution(id: string) {
    const contribution = await this.prisma.projectContribution.findUnique({
      where: { id },
      include: {
        project: true,
        user: {
          select: {
            id: true,
            firstName: true,
            email: true,
          },
        },
      },
    });

    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    return contribution;
  }

  async updateContribution(
    id: string,
    updateContributionDto: UpdateContributionDto,
  ) {
    const contribution = await this.prisma.projectContribution.findUnique({
      where: { id },
    });

    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    const data: any = {};

    if (updateContributionDto.projectId)
      data.projectId = updateContributionDto.projectId;
    if (updateContributionDto.userId)
      data.userId = updateContributionDto.userId;
    if (updateContributionDto.amount !== undefined)
      data.amount = updateContributionDto.amount;
    if (updateContributionDto.date)
      data.date = new Date(updateContributionDto.date);
    if (updateContributionDto.note !== undefined)
      data.note = updateContributionDto.note || null;

    return this.prisma.projectContribution.update({
      where: { id },
      data,
      include: {
        project: true,
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

  async removeContribution(id: string) {
    const contribution = await this.prisma.projectContribution.findUnique({
      where: { id },
    });

    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    await this.prisma.projectContribution.delete({
      where: { id },
    });

    return { message: 'Contribution deleted successfully' };
  }

  // Helper: Calculate project progress
  private calculateProjectProgress(project: any) {
    const totalContributed = project.contributions.reduce(
      (sum: number, contrib: any) => sum + contrib.amount,
      0,
    );

    const progressPercentage =
      project.targetAmount > 0
        ? Math.min((totalContributed / project.targetAmount) * 100, 100)
        : 0;

    return {
      ...project,
      totalContributed,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
      remainingAmount: Math.max(project.targetAmount - totalContributed, 0),
    };
  }
}
