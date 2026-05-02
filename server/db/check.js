const { get, all, close, DB_PATH } = require('./sqlite');

async function checkDatabase() {
  try {
    console.log('[db:check] Database path:', DB_PATH);

    const tables = await all(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      ORDER BY name ASC
    `);

    console.log('[db:check] Tables:');
    console.table(tables);

    const admin = await get(
      'SELECT id, username, role, status, created_at FROM users WHERE username = ?',
      ['admin']
    );

    if (admin) {
      console.log('[db:check] Default admin exists:');
      console.table([admin]);
    } else {
      console.log('[db:check] Default admin not found.');
    }
  } catch (error) {
    console.error('[db:check] Failed:', error.message);
    process.exitCode = 1;
  } finally {
    await close().catch((err) => {
      console.error('[db:check] Close error:', err.message);
    });
  }
}

if (require.main === module) {
  checkDatabase();
}

module.exports = {
  checkDatabase
};