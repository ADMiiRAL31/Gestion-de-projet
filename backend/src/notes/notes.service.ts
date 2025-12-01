import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: createNoteDto,
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
    return this.prisma.note.findMany({
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

  async findByUser(userId: string) {
    return this.prisma.note.findMany({
      where: { userId },
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

  async findByCategory(category: string) {
    return this.prisma.note.findMany({
      where: { category: category as any },
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
    const note = await this.prisma.note.findUnique({
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

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const note = await this.findOne(id);

    return this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
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
    const note = await this.findOne(id);

    return this.prisma.note.delete({
      where: { id },
    });
  }

  async toggleComplete(id: string) {
    const note = await this.findOne(id);

    return this.prisma.note.update({
      where: { id },
      data: {
        completed: !note.completed,
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
}
