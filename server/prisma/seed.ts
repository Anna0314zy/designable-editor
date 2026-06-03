import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.systemVersion.upsert({
    where: { systemName: 'SLIDE_TASK' },
    update: { version: '1.0.3' },
    create: { systemName: 'SLIDE_TASK', version: '1.0.3' },
  })
  await prisma.systemVersion.upsert({
    where: { systemName: 'SLIDE_EDITOR' },
    update: { version: '1.0.6' },
    create: { systemName: 'SLIDE_EDITOR', version: '1.0.6' },
  })
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: await bcrypt.hash('admin123456', 12),
      roles: [UserRole.admin],
    },
  })
  await prisma.course.upsert({
    where: { id: 'course-demo-001' },
    update: {},
    create: {
      id: 'course-demo-001',
      name: '本地联调示例课程',
      cityName: '北京',
      year: '2026',
      seasonName: '春季',
      gradeName: '一年级',
      subjectName: '数学',
      bookVersionName: '通用版',
      productTypeName: '系统课',
    },
  })
}

void main().finally(() => prisma.$disconnect())
