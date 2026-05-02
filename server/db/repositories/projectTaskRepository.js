const { all, get, run } = require('../sqlite');

async function listByProjectId(projectId) {
  return all(
    `
    SELECT pt.*,
           p.name AS phase_name,
           tt.name AS template_name
    FROM project_tasks pt
    LEFT JOIN phases p ON pt.phase_id = p.id
    LEFT JOIN task_templates tt ON pt.task_template_id = tt.id
    WHERE pt.project_id = ?
    ORDER BY pt.phase_id ASC, pt.sort_order ASC, pt.id ASC
    `,
    [projectId]
  );
}

async function listByPhaseId(phaseId) {
  return all(
    `
    SELECT *
    FROM project_tasks
    WHERE phase_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [phaseId]
  );
}

async function listByProjectAndPhase(projectId, phaseId) {
  return all(
    `
    SELECT *
    FROM project_tasks
    WHERE project_id = ? AND phase_id = ?
    ORDER BY sort_order ASC, id ASC
    `,
    [projectId, phaseId]
  );
}

async function findById(id) {
  return get('SELECT * FROM project_tasks WHERE id = ?', [id]);
}

async function create(data) {
  return run(
    `
    INSERT INTO project_tasks (
      project_id, phase_id, task_template_id, name, description, command_template,
      status, sort_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
    `,
    [
      data.project_id,
      data.phase_id,
      data.task_template_id,
      data.name,
      data.description || '',
      data.command_template,
      data.status || 'pending',
      data.sort_order || 0
    ]
  );
}

async function update(id, data) {
  return run(
    `
    UPDATE project_tasks
    SET phase_id = ?,
        name = ?,
        description = ?,
        command_template = ?,
        status = ?,
        sort_order = ?,
        updated_at = datetime('now', 'localtime')
    WHERE id = ?
    `,
    [
      data.phase_id,
      data.name,
      data.description || '',
      data.command_template,
      data.status || 'pending',
      data.sort_order || 0,
      id
    ]
  );
}

async function updateStatus(id, status) {
  return run(
    `
    UPDATE project_tasks
    SET status = ?,
        last_run_at = CASE
          WHEN ? IN ('running', 'completed', 'failed', 'stopped', '杩愯涓?', '瀹屾垚', '澶辫触', '鍋滄') THEN datetime('now', 'localtime')
          ELSE last_run_at
        END,
        updated_at = datetime('now', 'localtime')
    WHERE id = ?
    `,
    [status, status, id]
  );
}

async function reorder(projectId, items = []) {
  for (const item of items) {
    await run(
      `
      UPDATE project_tasks
      SET phase_id = ?,
          sort_order = ?,
          updated_at = datetime('now', 'localtime')
      WHERE id = ? AND project_id = ?
      `,
      [item.phase_id, item.sort_order, item.id, projectId]
    );
  }

  return listByProjectId(projectId);
}

async function moveTask(id, targetPhaseId, sortOrder) {
  return run(
    `
    UPDATE project_tasks
    SET phase_id = ?,
        sort_order = ?,
        updated_at = datetime('now', 'localtime')
    WHERE id = ?
    `,
    [targetPhaseId, sortOrder, id]
  );
}

async function resetTasksStatusByPhase(phaseId) {
  return run(
    `
    UPDATE project_tasks
    SET status = 'pending',
        updated_at = datetime('now', 'localtime')
    WHERE phase_id = ?
    `,
    [phaseId]
  );
}

async function remove(id) {
  return run('DELETE FROM project_tasks WHERE id = ?', [id]);
}

module.exports = {
  listByProjectId,
  listByPhaseId,
  listByProjectAndPhase,
  findById,
  create,
  update,
  updateStatus,
  reorder,
  moveTask,
  resetTasksStatusByPhase,
  remove
};
