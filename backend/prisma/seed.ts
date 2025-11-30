import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (optional - comment out if you want to keep existing data)
  await prisma.projectContribution.deleteMany();
  await prisma.coupleProject.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.recurringExpense.deleteMany();
  await prisma.income.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleaned existing data');

  // Create users: Younes and Asmae
  const hashedPassword = await bcrypt.hash('password123', 10);

  const younes = await prisma.user.create({
    data: {
      firstName: 'Younes',
      email: 'younes@couple-life.com',
      passwordHash: hashedPassword,
    },
  });

  const asmae = await prisma.user.create({
    data: {
      firstName: 'Asmae',
      email: 'asmae@couple-life.com',
      passwordHash: hashedPassword,
    },
  });

  console.log('✅ Created users: Younes and Asmae');

  // Create sample incomes
  await prisma.income.createMany({
    data: [
      {
        userId: younes.id,
        type: 'SALARY',
        label: 'Monthly Salary',
        amount: 15000,
        currency: 'MAD',
        startDate: new Date('2024-01-01'),
        isRecurring: true,
      },
      {
        userId: asmae.id,
        type: 'SALARY',
        label: 'Monthly Salary',
        amount: 12000,
        currency: 'MAD',
        startDate: new Date('2024-01-01'),
        isRecurring: true,
      },
      {
        userId: younes.id,
        type: 'FREELANCE',
        label: 'Freelance Projects',
        amount: 3000,
        currency: 'MAD',
        startDate: new Date('2024-01-01'),
        isRecurring: true,
      },
    ],
  });

  console.log('✅ Created sample incomes');

  // Create sample recurring expenses
  await prisma.recurringExpense.createMany({
    data: [
      {
        userId: younes.id,
        isShared: true,
        category: 'HOUSING',
        label: 'Rent',
        amount: 5000,
        currency: 'MAD',
        billingPeriod: 'MONTHLY',
        startDate: new Date('2024-01-01'),
        provider: 'Landlord',
      },
      {
        userId: null,
        isShared: true,
        category: 'UTILITIES',
        label: 'Electricity',
        amount: 400,
        currency: 'MAD',
        billingPeriod: 'MONTHLY',
        startDate: new Date('2024-01-01'),
        provider: 'LYDEC',
      },
      {
        userId: null,
        isShared: true,
        category: 'UTILITIES',
        label: 'Water',
        amount: 150,
        currency: 'MAD',
        billingPeriod: 'MONTHLY',
        startDate: new Date('2024-01-01'),
        provider: 'LYDEC',
      },
      {
        userId: null,
        isShared: true,
        category: 'UTILITIES',
        label: 'Internet',
        amount: 300,
        currency: 'MAD',
        billingPeriod: 'MONTHLY',
        startDate: new Date('2024-01-01'),
        provider: 'Maroc Telecom',
      },
      {
        userId: younes.id,
        isShared: false,
        category: 'SUBSCRIPTION',
        label: 'Gym Membership',
        amount: 500,
        currency: 'MAD',
        billingPeriod: 'MONTHLY',
        startDate: new Date('2024-01-01'),
        provider: 'Fitness Club',
      },
      {
        userId: null,
        isShared: true,
        category: 'INSURANCE',
        label: 'Car Insurance',
        amount: 3600,
        currency: 'MAD',
        billingPeriod: 'YEARLY',
        startDate: new Date('2024-01-01'),
        provider: 'Wafa Assurance',
      },
    ],
  });

  console.log('✅ Created sample recurring expenses');

  // Create sample loans
  await prisma.loan.createMany({
    data: [
      {
        userId: null,
        isShared: true,
        label: 'Car Loan',
        totalAmount: 200000,
        remainingAmount: 150000,
        monthlyPayment: 4000,
        interestRate: 5.5,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2027-06-01'),
        lender: 'Attijariwafa Bank',
      },
      {
        userId: younes.id,
        isShared: false,
        label: 'Personal Loan',
        totalAmount: 50000,
        remainingAmount: 30000,
        monthlyPayment: 2000,
        interestRate: 7.0,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-06-01'),
        lender: 'BMCE Bank',
      },
    ],
  });

  console.log('✅ Created sample loans');

  // Create sample couple projects
  const project1 = await prisma.coupleProject.create({
    data: {
      title: 'Dream Honeymoon in Bali',
      description: 'Save for a 2-week honeymoon trip to Bali, Indonesia',
      targetAmount: 60000,
      currency: 'MAD',
      targetDate: new Date('2025-06-01'),
      status: 'IN_PROGRESS',
      priority: 'HIGH',
    },
  });

  const project2 = await prisma.coupleProject.create({
    data: {
      title: 'Emergency Fund',
      description: '6 months of expenses as emergency savings',
      targetAmount: 90000,
      currency: 'MAD',
      targetDate: new Date('2025-12-31'),
      status: 'IN_PROGRESS',
      priority: 'HIGH',
    },
  });

  const project3 = await prisma.coupleProject.create({
    data: {
      title: 'New Furniture for Living Room',
      description: 'Modern sofa set and coffee table',
      targetAmount: 25000,
      currency: 'MAD',
      targetDate: new Date('2025-03-31'),
      status: 'PLANNING',
      priority: 'MEDIUM',
    },
  });

  const project4 = await prisma.coupleProject.create({
    data: {
      title: 'Down Payment for Apartment',
      description: 'Save for 20% down payment on our first apartment',
      targetAmount: 300000,
      currency: 'MAD',
      targetDate: new Date('2026-12-31'),
      status: 'IDEA',
      priority: 'HIGH',
    },
  });

  console.log('✅ Created sample couple projects');

  // Create sample contributions
  await prisma.projectContribution.createMany({
    data: [
      // Bali trip contributions
      {
        projectId: project1.id,
        userId: younes.id,
        amount: 8000,
        date: new Date('2024-01-15'),
        note: 'First contribution',
      },
      {
        projectId: project1.id,
        userId: asmae.id,
        amount: 5000,
        date: new Date('2024-01-20'),
        note: 'January savings',
      },
      {
        projectId: project1.id,
        userId: younes.id,
        amount: 7000,
        date: new Date('2024-02-15'),
        note: 'February bonus',
      },
      // Emergency fund contributions
      {
        projectId: project2.id,
        userId: younes.id,
        amount: 10000,
        date: new Date('2024-01-01'),
        note: 'Initial deposit',
      },
      {
        projectId: project2.id,
        userId: asmae.id,
        amount: 8000,
        date: new Date('2024-01-01'),
        note: 'Initial deposit',
      },
      {
        projectId: project2.id,
        userId: younes.id,
        amount: 5000,
        date: new Date('2024-02-01'),
        note: 'Monthly contribution',
      },
      {
        projectId: project2.id,
        userId: asmae.id,
        amount: 4000,
        date: new Date('2024-02-01'),
        note: 'Monthly contribution',
      },
      // Furniture contributions
      {
        projectId: project3.id,
        userId: younes.id,
        amount: 3000,
        date: new Date('2024-02-10'),
        note: 'Started saving',
      },
      {
        projectId: project3.id,
        userId: asmae.id,
        amount: 2500,
        date: new Date('2024-02-10'),
        note: 'Started saving',
      },
    ],
  });

  console.log('✅ Created sample project contributions');

  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📧 Login credentials:');
  console.log('   Younes: younes@couple-life.com / password123');
  console.log('   Asmae:  asmae@couple-life.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
