import { db } from './drizzle';
import { users } from './schema';
import { seed } from 'drizzle-seed';

async function main() {
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
  process.exit();
}

main();
