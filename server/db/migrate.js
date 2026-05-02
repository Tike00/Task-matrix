const fs = require('fs');
const path = require('path');
const { exec, close, DB_PATH } = require('./sqlite');

const SCHEMA_PATH = path.join(__dirname, '..', 'database_schema.sql');

async function migrate() {
  try {
    if (!fs.existsSync(SCHEMA_PATH)) {
      throw new Error(`Schema file not found: ${SCHEMA_PATH}`);
    }

    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');

    console.log('[db:migrate] Database path:', DB_PATH);
    console.log('[db:migrate] Applying schema...');
    await exec(schemaSql);
    console.log('[db:migrate] Schema applied successfully.');
  } catch (error) {
    console.error('[db:migrate] Failed:', error.message);
    process.exitCode = 1;
  } finally {
    await close().catch((err) => {
      console.error('[db:migrate] Close error:', err.message);
    });
  }
}

if (require.main === module) {
  migrate();
}

module.exports = {
  migrate
};