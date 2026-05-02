const { close, DB_PATH } = require('./sqlite');
const { bootstrapDatabase } = require('./bootstrap');

async function initDatabase() {
  try {
    console.log('[db:init] Start initialize database...');
    await bootstrapDatabase();
    console.log(`[db:init] Schema ensured successfully: ${DB_PATH}`);
    console.log('[db:init] Seed completed successfully.');
    console.log('[db:init] Database initialization finished.');
  } catch (error) {
    console.error('[db:init] Failed:', error);
    process.exitCode = 1;
  } finally {
    await close().catch((err) => {
      console.error('[db:init] Failed to close database:', err.message);
    });
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = {
  initDatabase
};
