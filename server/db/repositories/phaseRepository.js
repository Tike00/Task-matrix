const { all, get, run } = require('../sqlite');

async function listByProjectId(projectId) {
  return all(
    'SELECT * FROM phases WHERE project_id = ? ORDER BY sort_order ASC, id ASC',
    [projectId]
  );
}

async function findById(id) {
  return get('SELECT * FROM phases WHERE id = ?', [id]);
}

async function create(data) {
  return run(
    `
    INSERT INTO phases (
      project_id, name, description, sort_order, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
    `,
    [data.project_id, data.name, data.description || '', data.sort_order || 0, data.status || 'pending']
  );
}

async function update(id, data) {
  return run(
    `
    UPDATE phases
    SET name = ?, description = ?, sort_order = ?, status = ?, updated_at = datetime('now', 'localtime')
    WHERE id = ?
    `,
    [data.name, data.description || '', data.sort_order || 0, data.status || 'pending', id]
  );
}

async function remove(id) {
  return run('DELETE FROM phases WHERE id = ?', [id]);
}

async function reorder(projectId, items = []) {
  for (const item of items) {
    await run(
      `
      UPDATE phases
      SET sort_order = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ? AND project_id = ?
      `,
      [item.sort_order, item.id, projectId]
    );
  }

  return listByProjectId(projectId);
}

async function updateSummary(id, rawSummary, sanitizedSummary) {
  return run(
    `
    UPDATE phases
    SET raw_summary = ?,
        sanitized_summary = ?,
        last_executed_at = datetime('now', 'localtime'),
        updated_at = datetime('now', 'localtime')
    WHERE id = ?
    `,
    [rawSummary || '', sanitizedSummary || '', id]
  );
}

async function updateStatus(id, status) {
  return run(
    `
    UPDATE phases
    SET status = ?, updated_at = datetime('now', 'localtime')
    WHERE id = ?
    `,
    [status, id]
  );
}

module.exports = {
  listByProjectId,
  findById,
  create,
  update,
  remove,
  reorder,
  updateSummary,
  updateStatus
};