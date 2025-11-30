import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.projectContribution.deleteMany();
  await prisma.coupleProject.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.recurringExpense.deleteMany();
  await prisma.income.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create users: Younes & Asmae
  const younesPassword = await bcrypt.hash('younes123', 10);
  const asmaePassword = await bcrypt.hash('asmae123', 10);

  const younes = await prisma.user.create({
    data: {
      firstName: 'Younes',
      email: 'younes@example.com',
      passwordHash: younesPassword,
    },
  });

  const asmae = await prisma.user.create({
    data: {
      firstName: 'Asmae',
      email: 'asmae@example.com',
      passwordHash: asmaePassword,
    },
  });

  console.log('✅ Created users: Younes & Asmae');

  // Create incomes
  await prisma.income.createMany({
    data: [
      {
        userId: younes.id,
        type: 'salary',
        label: 'Monthly Salary - Tech Company',
        amount: 4500,
        currency: 'EUR',
        startDate: new Date('2023-01-01'),
        isRecurring: true,
      },
      {
        userId: asmae.id,
        type: 'salary',
        label: 'Monthly Salary - Marketing Agency',
        amount: 3800,
        currency: 'EUR',
        startDate: new Date('2023-01-01'),
        isRecurring: true,
      },
      {
        userId: younes.id,
        type: 'freelance',
        label: 'Freelance Web Development',
        amount: 800,
        currency: 'EUR',
        startDate: new Date('2024-01-01'),
        isRecurring: true,
      },
    ],
  });

  console.log('✅ Created incomes');

  // Create recurring expenses
  await prisma.recurringExpense.createMany({
    data: [
      {
        userId: null,
        isShared: true,
        category: 'rent',
        label: 'Apartment Rent',
        amount: 1200,
        currency: 'EUR',
        billingPeriod: 'monthly',
        startDate: new Date('2023-01-01'),
        provider: 'Property Management Co.',
      },
      {
        userId: null,
        isShared: true,
        category: 'utilities',
        label: 'Electricity & Water',
        amount: 150,
        currency: 'EUR',
        billingPeriod: 'monthly',
        startDate: new Date('2023-01-01'),
        provider: 'Utility Company',
      },
      {
        userId: null,
        isShared: true,
        category: 'utilities',
        label: 'Internet & Phone',
        amount: 60,
        currency: 'EUR',
        billingPeriod: 'monthly',
        startDate: new Date('2023-01-01'),
        provider: 'Telecom Provider',
      },
      {
        userId: younes.id,
        isShared: false,
        category: 'insurance',
        label: 'Car Insurance',
        amount: 600,
        currency: 'EUR',
        billingPeriod: 'yearly',
        startDate: new Date('2023-01-01'),
        provider: 'Insurance Co.',
      },
      {
        userId: asmae.id,
        isShared: false,
        category: 'subscription',
        label: 'Gym Membership',
        amount: 45,
        currency: 'EUR',
        billingPeriod: 'monthly',
        startDate: new Date('2023-06-01'),
        provider: 'FitLife Gym',
      },
      {
        userId: null,
        isShared: true,
        category: 'subscription',
        label: 'Netflix Subscription',
        amount: 15.99,
        currency: 'EUR',
        billingPeriod: 'monthly',
        startDate: new Date('2023-01-01'),
        provider: 'Netflix',
      },
      {
        userId: null,
        isShared: true,
        category: 'utilities',
        label: 'Groceries (Average)',
        amount: 500,
        currency: 'EUR',
        billingPeriod: 'monthly',
        startDate: new Date('2023-01-01'),
      },
    ],
  });

  console.log('✅ Created recurring expenses');

  // Create loans
  await prisma.loan.createMany({
    data: [
      {
        userId: younes.id,
        isShared: false,
        label: 'Car Loan',
        totalAmount: 25000,
        remainingAmount: 18000,
        monthlyPayment: 450,
        interestRate: 3.5,
        startDate: new Date('2022-01-01'),
        endDate: new Date('2026-12-31'),
        lender: 'Bank XYZ',
      },
      {
        userId: null,
        isShared: true,
        label: 'Home Furniture Loan',
        totalAmount: 8000,
        remainingAmount: 4500,
        monthlyPayment: 200,
        interestRate: 2.9,
        startDate: new Date('2023-03-01'),
        endDate: new Date('2026-03-31'),
        lender: 'Furniture Store Credit',
      },
    ],
  });

  console.log('✅ Created loans');

  // Create couple projects
  const savingsProject = await prisma.coupleProject.create({
    data: {
      title: 'House Down Payment',
      description: 'Saving for our dream home down payment',
      targetAmount: 50000,
      currency: 'EUR',
      targetDate: new Date('2026-06-30'),
      status: 'IN_PROGRESS',
      priority: 'HIGH',
    },
  });

  const travelProject = await prisma.coupleProject.create({
    data: {
      title: 'Japan Trip 2025',
      description: 'Dream vacation to Japan for 2 weeks',
      targetAmount: 8000,
      currency: 'EUR',
      targetDate: new Date('2025-09-01'),
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
    },
  });

  const weddingProject = await prisma.coupleProject.create({
    data: {
      title: 'Wedding Anniversary Celebration',
      description: 'Special celebration for our 5th anniversary',
      targetAmount: 3000,
      currency: 'EUR',
      targetDate: new Date('2025-05-15'),
      status: 'PLANNING',
      priority: 'MEDIUM',
    },
  });

  const investmentProject = await prisma.coupleProject.create({
    data: {
      title: 'Investment Portfolio',
      description: 'Building our investment portfolio for long-term wealth',
      targetAmount: 30000,
      currency: 'EUR',
      targetDate: new Date('2027-12-31'),
      status: 'IDEA',
      priority: 'LOW',
    },
  });

  console.log('✅ Created couple projects');

  // Add contributions to projects
  await prisma.projectContribution.createMany({
    data: [
      // House down payment contributions
      {
        projectId: savingsProject.id,
        userId: younes.id,
        amount: 5000,
        date: new Date('2024-01-15'),
        note: 'Initial contribution from bonus',
      },
      {
        projectId: savingsProject.id,
        userId: asmae.id,
        amount: 4000,
        date: new Date('2024-01-20'),
        note: 'Starting our home fund',
      },
      {
        projectId: savingsProject.id,
        userId: younes.id,
        amount: 2500,
        date: new Date('2024-06-15'),
        note: 'Mid-year savings',
      },
      {
        projectId: savingsProject.id,
        userId: asmae.id,
        amount: 3000,
        date: new Date('2024-07-10'),
        note: 'Summer savings',
      },
      // Japan trip contributions
      {
        projectId: travelProject.id,
        userId: younes.id,
        amount: 1500,
        date: new Date('2024-03-01'),
        note: 'Starting Japan fund',
      },
      {
        projectId: travelProject.id,
        userId: asmae.id,
        amount: 1200,
        date: new Date('2024-03-15'),
        note: 'Excited for Japan!',
      },
      {
        projectId: travelProject.id,
        userId: younes.id,
        amount: 800,
        date: new Date('2024-09-01'),
        note: 'Monthly savings',
      },
      // Anniversary celebration
      {
        projectId: weddingProject.id,
        userId: younes.id,
        amount: 500,
        date: new Date('2024-10-01'),
        note: 'Anniversary fund start',
      },
      {
        projectId: weddingProject.id,
        userId: asmae.id,
        amount: 500,
        date: new Date('2024-10-01'),
        note: 'Looking forward to it!',
      },
    ],
  });

  console.log('✅ Created project contributions');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('-----------------------------------');
  console.log('Younes:');
  console.log('  Email: younes@example.com');
  console.log('  Password: younes123');
  console.log('\nAsmae:');
  console.log('  Email: asmae@example.com');
  console.log('  Password: asmae123');
  console.log('-----------------------------------\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
