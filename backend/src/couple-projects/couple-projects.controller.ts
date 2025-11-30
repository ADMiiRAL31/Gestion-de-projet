import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CoupleProjectsService } from './couple-projects.service';
import { CreateCoupleProjectDto } from './dto/create-couple-project.dto';
import { UpdateCoupleProjectDto } from './dto/update-couple-project.dto';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('couple-projects')
@UseGuards(JwtAuthGuard)
export class CoupleProjectsController {
  constructor(private coupleProjectsService: CoupleProjectsService) {}

  @Post()
  create(@Body() createCoupleProjectDto: CreateCoupleProjectDto) {
    return this.coupleProjectsService.create(createCoupleProjectDto);
  }

  @Get()
  findAll() {
    return this.coupleProjectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coupleProjectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoupleProjectDto: UpdateCoupleProjectDto) {
    return this.coupleProjectsService.update(id, updateCoupleProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coupleProjectsService.remove(id);
  }

  // Contribution endpoints
  @Post('contributions')
  addContribution(@Body() createContributionDto: CreateContributionDto) {
    return this.coupleProjectsService.addContribution(createContributionDto);
  }

  @Get(':id/contributions')
  getContributions(@Param('id') projectId: string) {
    return this.coupleProjectsService.getContributions(projectId);
  }

  @Delete('contributions/:contributionId')
  deleteContribution(@Param('contributionId') contributionId: string) {
    return this.coupleProjectsService.deleteContribution(contributionId);
  }
}
