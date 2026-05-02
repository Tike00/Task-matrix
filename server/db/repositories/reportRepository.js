const { all, run } = require('../sqlite');

async function list() {
  return all('SELECT * FROM reports ORDER BY id DESC');
}

async function create(data) {
  return run(
    `
    INSERT INTO reports (
      project_id, title, report_type, file_path, content,
      exported_by, exported_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'), datetime('now', 'localtime'))
    `,
    [
      data.project_id,
      data.title,
      data.report_type || 'project_summary',
      data.file_path || '',
      data.content || '',
      data.exported_by
    ]
  );
}

module.exports = {
  list,
  create
};