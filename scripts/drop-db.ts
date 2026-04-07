import { db } from "../lib/db/index";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Dropping all tables to fix type mismatch...");
  const tables = [
    "like",
    "comment",
    "saved_resource",
    "resource_file",
    "permission",
    "notification",
    "follow",
    "resource",
    "session",
    "account",
    "verification",
    "user"
  ];

  for (const table of tables) {
    try {
      await db.execute(sql.raw(`DROP TABLE IF EXISTS "${table}" CASCADE`));
      console.log(`Dropped table: ${table}`);
    } catch (e) {
      console.error(`Failed to drop table ${table}:`, e);
    }
  }

  // Also drop enums
  const enums = ["resource_category", "visibility", "permission_type"];
  for (const en of enums) {
    try {
      await db.execute(sql.raw(`DROP TYPE IF EXISTS "${en}" CASCADE`));
      console.log(`Dropped enum: ${en}`);
    } catch (e) {
      console.error(`Failed to drop enum ${en}:`, e);
    }
  }

  console.log("Database cleaned!");
}

main().catch(console.error);
