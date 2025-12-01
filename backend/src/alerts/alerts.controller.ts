import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.create(createAlertDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string, @Query('type') type?: string) {
    return this.alertsService.findAll(userId, type);
  }

  @Get('unread')
  findUnread(@Query('userId') userId?: string) {
    return this.alertsService.findUnread(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertDto: UpdateAlertDto) {
    return this.alertsService.update(id, updateAlertDto);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.alertsService.markAsRead(id);
  }

  @Patch('read-all/user')
  markAllAsRead(@Query('userId') userId?: string) {
    return this.alertsService.markAllAsRead(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsService.remove(id);
  }
}
