import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AlertType } from '@prisma/client';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async create(createAlertDto: CreateAlertDto) {
    return this.prisma.alert.create({
      data: {
        ...createAlertDto,
        type: createAlertDto.type as AlertType,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string, type?: string) {
    const where: any = {};

    if (userId) {
      where.OR = [
        { userId },
        { userId: null }, // Alertes globales
      ];
    }

    if (type) {
      where.type = type as AlertType;
    }

    return this.prisma.alert.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findUnread(userId?: string) {
    const where: any = { isRead: false };

    if (userId) {
      where.OR = [
        { userId },
        { userId: null },
      ];
    }

    return this.prisma.alert.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findByType(type: AlertType, userId?: string) {
    const where: any = { type };

    if (userId) {
      where.OR = [
        { userId },
        { userId: null },
      ];
    }

    return this.prisma.alert.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const alert = await this.prisma.alert.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!alert) {
      throw new NotFoundException(`Alerte avec l'ID ${id} non trouvée`);
    }

    return alert;
  }

  async update(id: string, updateAlertDto: UpdateAlertDto) {
    await this.findOne(id);

    const updateData: any = { ...updateAlertDto };
    if (updateAlertDto.type) {
      updateData.type = updateAlertDto.type as AlertType;
    }

    return this.prisma.alert.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async markAsRead(id: string) {
    await this.findOne(id);

    return this.prisma.alert.update({
      where: { id },
      data: { isRead: true },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async markAllAsRead(userId?: string) {
    const where: any = { isRead: false };

    if (userId) {
      where.OR = [
        { userId },
        { userId: null },
      ];
    }

    return this.prisma.alert.updateMany({
      where,
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.alert.delete({
      where: { id },
    });
  }

  // Méthode utilitaire pour créer des alertes automatiques
  async createAutomaticAlert(
    type: AlertType,
    title: string,
    description: string,
    userId?: string,
    actionUrl?: string,
  ) {
    return this.create({
      type,
      title,
      description,
      userId,
      actionUrl,
      isRead: false,
    });
  }
}
