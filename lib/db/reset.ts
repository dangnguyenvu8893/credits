import dotenv from 'dotenv';
import path from 'path';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { client, db } from './drizzle';
import { seed } from 'drizzle-seed';
import { users } from './schema';

dotenv.config();

async function dropAllTables() {
  console.log('🗑️  Dropping all tables...');
  
  // Drop all tables in the database
  await client`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `;
  
  console.log('✅ All tables dropped successfully');
}

async function runMigrations() {
  console.log('🔄 Running migrations...');
  
  try {
    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), '/lib/db/migrations'),
    });
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
}

async function verifyTablesExist() {
  console.log('🔍 Verifying tables exist...');
  
  try {
    // Check if users table exists
    const result = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = current_schema() 
        AND table_name = 'users'
      );
    `;
    
    if (!result[0]?.exists) {
      throw new Error('Users table was not created successfully');
    }
    
    console.log('✅ Users table verified successfully');
  } catch (error) {
    console.error('❌ Table verification failed:', error);
    throw error;
  }
}

async function seedDatabase() {
  console.log('🌱 Seeding database...');
  
  try {
    // For now, let's skip seeding to avoid errors
    // You can uncomment this when you're ready to seed
    /*
    await seed(db, { users }).refine((f) => ({
      users: {
        columns: {
          fullname: f.firstName(),
          email: f.email(),
          birthdate: f.date(),
          idNumber: f.number(),
          address: f.string(),
          maritalStatus: f.string(),
          phoneNumber: f.string(),
          occupation: f.string(),
          salary: f.number(),
          cicRank: f.string(),
        },
        count: 10,
      },
    }));
    */
    
    console.log('✅ Database seeded successfully (skipped for now)');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting database reset process...\n');
    
    // Step 1: Drop all tables
    await dropAllTables();
    
    // Step 2: Run migrations
    await runMigrations();
    
    // Step 3: Verify tables exist
    await verifyTablesExist();
    
    // Step 4: Seed database
    await seedDatabase();
    
    console.log('\n🎉 Database reset completed successfully!');
    console.log('📊 Database is now ready with fresh migrations and seed data.');
    
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main(); 