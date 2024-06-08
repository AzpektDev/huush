import dotenv from "dotenv";
import path from "path";
import { DataSource } from "typeorm";
import { Migration } from "../entities/Migrations";
import { Console } from "../util/Console";

const console = new Console();

dotenv.config();

let dbConnection: DataSource | undefined;

const dbConnectionString = process.env.DATABASE || path.join(process.cwd(), "database.db");

const DatabaseType = dbConnectionString.includes("://") ? dbConnectionString.split(":")[0]?.replace("+srv", "") : "postgres";

const DataSourceOptions = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_DATABASE || "postgres",
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, "..", "entities", "*.ts")],
  migrations: [path.join(__dirname, "..", "migrations", "*.ts")],
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // },
});

export function getDatabase(): DataSource | null {
  if (!dbConnection) return null;
  return dbConnection;
}

// Called on server start
export async function initDatabase(): Promise<DataSource> {
  if (dbConnection) return dbConnection;

  console.log(`Connecting to ${DatabaseType} db...`, "db", "pink");

  dbConnection = await DataSourceOptions.initialize();

  await dbConnection.synchronize();
  console.warn("Fresh starting database (Database.ts 50:57)");

  // check if migrations table exists using typeorm
  const dbExists = async () => {
    const queryRunner = dbConnection.createQueryRunner();
    const table = await queryRunner.hasTable("migrations");
    await queryRunner.release();
    return table;
  };
  if (!(await dbExists())) {
    console.log("This appears to be a new database. Synchronising...", "DB", "pink");
    await dbConnection.synchronize();
    console.log("Synchronisation complete!", "db", "pink");

    await Promise.all(
      dbConnection.migrations.map((migration) =>
        Migration.insert({
          name: migration.name,
          timestamp: Date.now(),
        })
      )
    );
  } else {
    console.log("Applying missing migrations...", "db", "pink");
    await dbConnection.runMigrations();
  }

  console.log(`Connected to ${DatabaseType} db`, "db", "pink");

  return dbConnection;
}

export { dbConnection, DataSourceOptions, DatabaseType };

export async function closeDatabase() {
  await dbConnection?.destroy();
}