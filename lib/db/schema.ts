import { pgTable, varchar, timestamp, uuid, date, integer, text } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullname: varchar('fullname', { length: 255 }).notNull(),
  birthdate: date('birthdate').notNull(),
  idNumber: varchar('id_number', { length: 20 }).notNull().unique(),
  address: text('address').notNull(),
  maritalStatus: varchar('marital_status', { length: 50 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  occupation: varchar('occupation', { length: 255 }).notNull(),
  salary: integer('salary').notNull(), // VND
  cicRank: varchar('cic_rank', { length: 50 }).notNull(),
  // AI Prediction Results
  cardType: varchar('card_type', { length: 50 }),
  creditLimit: integer('credit_limit'),
  confidence: integer('confidence'), // Store as percentage (0-100)
  predictionReasons: text('prediction_reasons'), // JSON string of reasons array
  predictedAt: timestamp('predicted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type definitions
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
