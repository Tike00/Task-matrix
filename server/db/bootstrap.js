const fs = require('fs');
const path = require('path');
const { get, exec } = require('./sqlite');
const { seedAdmin } = require('./seed_admin');
const { seedTemplates } = require('./seed_templates');

const SCHEMA_PATH = path.join(__dirname, '..', 'database_schema.sql');

async function hasUsersTable() {
  const row = await get(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'"
  );
  return !!row;
}

async function bootstrapDatabase() {
  const initialized = await hasUsersTable();
  if (initialized) {
    return { initialized: false };
  }

  if (!fs.existsSync(SCHEMA_PATH)) {
    throw new Error(`Schema file not found: ${SCHEMA_PATH}`);
  }

  const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');

  console.log('[db:bootstrap] Initializing database schema...');
  await exec(schemaSql);
  await seedAdmin();
  await seedTemplates();
  console.log('[db:bootstrap] Database is ready.');

  return { initialized: true };
}

module.exports = {
  bootstrapDatabase
};
