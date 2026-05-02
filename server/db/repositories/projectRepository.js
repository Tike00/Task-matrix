const { all, get, run } = require('../sqlite');

async function list() {
  return all(`
    SELECT p.*, u.username AS created_by_name
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.id
    ORDER BY p.id DESC
  `);
}

async function create(data) {
  return run(
    `
    INSERT INTO projects (
      name, target_url, status, description, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
    `,
    [data.name, data.target_url, data.status || 'active', data.description || '', data.created_by]
  );
}

async function findById(id) {
  return get('SELECT * FROM projects WHERE id = ?', [id]);
}

async function update(id, data) {
  return run(
    `
    UPDATE projects
    SET name = ?, target_url = ?, status = ?, description = ?, updated_at = datetime('now', 'localtime')
    WHERE id = ?
    `,
    [data.name, data.target_url, data.status, data.description || '', id]
  );
}

async function remove(id) {
  return run('DELETE FROM projects WHERE id = ?', [id]);
}

module.exports = {
  list,
  create,
  findById,
  update,
  remove
};
