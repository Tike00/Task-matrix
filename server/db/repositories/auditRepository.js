const { all, run } = require('../sqlite');

async function list() {
  return all('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 500');
}

async function create(data) {
  return run(
    `
    INSERT INTO audit_logs (
      user_id, project_id, phase_id, project_task_id,
      action, command_text, details, ip_address,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
    `,
    [
      data.user_id,
      data.project_id || null,
      data.phase_id || null,
      data.project_task_id || null,
      data.action,
      data.command_text || '',
      data.details || '',
      data.ip_address || '127.0.0.1'
    ]
  );
}

async function removeById(id) {
  return run('DELETE FROM audit_logs WHERE id = ?', [id]);
}

async function removeAll() {
  return run('DELETE FROM audit_logs');
}

module.exports = {
  list,
  create,
  removeById,
  removeAll
};
