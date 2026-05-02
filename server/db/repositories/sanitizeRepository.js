const { all, run } = require('../sqlite');

async function createMany(projectId, phaseId, taskResultId, mappings = []) {
  for (const item of mappings) {
    await run(
      `
      INSERT INTO sanitized_mappings (
        project_id, phase_id, task_result_id,
        original_value, sanitized_value, value_type,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
      `,
      [
        projectId,
        phaseId || null,
        taskResultId || null,
        item.original_value,
        item.sanitized_value,
        item.value_type
      ]
    );
  }
}

async function listByTaskResultId(taskResultId) {
  return all(
    'SELECT * FROM sanitized_mappings WHERE task_result_id = ? ORDER BY id ASC',
    [taskResultId]
  );
}

async function listByPhaseId(phaseId) {
  return all(
    'SELECT * FROM sanitized_mappings WHERE phase_id = ? ORDER BY id ASC',
    [phaseId]
  );
}

module.exports = {
  createMany,
  listByTaskResultId,
  listByPhaseId
};