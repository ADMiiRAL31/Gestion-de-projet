import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IncomesModule } from './incomes/incomes.module';
import { RecurringExpensesModule } from './recurring-expenses/recurring-expenses.module';
import { LoansModule } from './loans/loans.module';
import { CoupleProjectsModule } from './couple-projects/couple-projects.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotesModule } from './notes/notes.module';
import { AlertsModule } from './alerts/alerts.module';
import { BudgetsModule } from './budgets/budgets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    IncomesModule,
    RecurringExpensesModule,
    LoansModule,
    CoupleProjectsModule,
    DashboardModule,
    NotesModule,
    AlertsModule,
    BudgetsModule,
  ],
})
export class AppModule {}
