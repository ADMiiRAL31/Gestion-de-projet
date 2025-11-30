import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  // Project routes
  @Post()
  createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Get()
  findAllProjects() {
    return this.projectsService.findAllProjects();
  }

  @Get(':id')
  findOneProject(@Param('id') id: string) {
    return this.projectsService.findOneProject(id);
  }

  @Patch(':id')
  updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  @Delete(':id')
  removeProject(@Param('id') id: string) {
    return this.projectsService.removeProject(id);
  }

  // Contribution routes
  @Post('contributions')
  createContribution(@Body() createContributionDto: CreateContributionDto) {
    return this.projectsService.createContribution(createContributionDto);
  }

  @Get('contributions/all')
  findAllContributions(@Query('projectId') projectId?: string) {
    return this.projectsService.findAllContributions(projectId);
  }

  @Get('contributions/:id')
  findOneContribution(@Param('id') id: string) {
    return this.projectsService.findOneContribution(id);
  }

  @Patch('contributions/:id')
  updateContribution(
    @Param('id') id: string,
    @Body() updateContributionDto: UpdateContributionDto,
  ) {
    return this.projectsService.updateContribution(id, updateContributionDto);
  }

  @Delete('contributions/:id')
  removeContribution(@Param('id') id: string) {
    return this.projectsService.removeContribution(id);
  }
}
