import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('overview')
  getFinancialOverview() {
    return this.dashboardService.getFinancialOverview();
  }

  @Get('user/:userId')
  getUserFinancialSummary(@Param('userId') userId: string) {
    return this.dashboardService.getUserFinancialSummary(userId);
  }
}
