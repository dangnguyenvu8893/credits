import { db } from './drizzle';
import { users, type User, type NewUser } from './schema';
import { InferSelectModel, eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// User queries
export async function getUsers() {
  try {
    return await db
      .select()
      .from(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return empty array if database connection fails
    return [];
  }
}

export async function getUserById(id: string) {
  return db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
}

export async function getUserByEmail(email: string) {
  return db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
}

export async function getUserByIdNumber(idNumber: string) {
  return db
    .select()
    .from(users)
    .where(eq(users.idNumber, idNumber))
    .limit(1);
}

export async function createUser(userData: NewUser) {
  return db
    .insert(users)
    .values(userData)
    .returning();
}

export async function updateUser(id: string, userData: Partial<NewUser>) {
  return db
    .update(users)
    .set({ ...userData, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
}

export async function deleteUser(id: string) {
  return db
    .delete(users)
    .where(eq(users.id, id))
    .returning();
}

// Dashboard statistics queries
export async function getDashboardStats() {
  try {
    // Total users count
    const totalUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    // Users by card type
    const usersByCardType = await db
      .select({
        cardType: users.cardType,
        count: sql<number>`count(*)`
      })
      .from(users)
      .where(sql`${users.cardType} is not null`)
      .groupBy(users.cardType);

    // Users by CIC rank
    const usersByCicRank = await db
      .select({
        cicRank: users.cicRank,
        count: sql<number>`count(*)`
      })
      .from(users)
      .groupBy(users.cicRank);

    // Total credit limit
    const totalCreditLimit = await db
      .select({ 
        total: sql<number>`coalesce(sum(${users.creditLimit}), 0)` 
      })
      .from(users)
      .where(sql`${users.creditLimit} is not null`);

    // Average credit limit
    const avgCreditLimit = await db
      .select({ 
        average: sql<number>`coalesce(avg(${users.creditLimit}), 0)` 
      })
      .from(users)
      .where(sql`${users.creditLimit} is not null`);

    // Users được cấp thẻ (cardType != null và != 'Reject')
    const analyzedUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.cardType} is not null and ${users.cardType} != 'Reject'`);

    // Users bị reject
    const rejectedUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.cardType} = 'Reject'`);

    // Users đang đợi duyệt (chưa có cardType)
    const pendingUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.cardType} is null`);

    // Users đã được duyệt tháng này
    const approvedThisMonth = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.cardType} is not null and ${users.cardType} != 'Reject' and ${users.predictedAt} >= date_trunc('month', current_date)`);

    return {
      totalUsers: totalUsers[0]?.count || 0,
      usersByCardType: usersByCardType,
      usersByCicRank: usersByCicRank,
      totalCreditLimit: totalCreditLimit[0]?.total || 0,
      avgCreditLimit: avgCreditLimit[0]?.average || 0,
      analyzedUsers: analyzedUsers[0]?.count || 0,
      rejectedUsers: rejectedUsers[0]?.count || 0,
      pendingUsers: pendingUsers[0]?.count || 0,
      approvedThisMonth: approvedThisMonth[0]?.count || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalUsers: 0,
      usersByCardType: [],
      usersByCicRank: [],
      totalCreditLimit: 0,
      avgCreditLimit: 0,
      analyzedUsers: 0,
      rejectedUsers: 0,
      pendingUsers: 0,
      approvedThisMonth: 0
    };
  }
}
