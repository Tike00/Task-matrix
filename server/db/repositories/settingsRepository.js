const { all, get, run } = require('../sqlite');

async function list() {
  return all('SELECT * FROM system_settings ORDER BY id ASC');
}

async function findByKey(settingKey) {
  return get('SELECT * FROM system_settings WHERE setting_key = ?', [settingKey]);
}

async function upsert(settingKey, settingValue, description = '') {
  const exists = await findByKey(settingKey);

  if (exists) {
    return run(
      `
      UPDATE system_settings
      SET setting_value = ?, description = ?, updated_at = datetime('now', 'localtime')
      WHERE setting_key = ?
      `,
      [settingValue, description, settingKey]
    );
  }

  return run(
    `
    INSERT INTO system_settings (
      setting_key, setting_value, description, created_at, updated_at
    ) VALUES (?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
    `,
    [settingKey, settingValue, description]
  );
}

module.exports = {
  list,
  findByKey,
  upsert
};