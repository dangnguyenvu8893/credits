import { db } from './drizzle';
import { users, type User, type NewUser } from './schema';
import { InferSelectModel, eq } from 'drizzle-orm';

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
