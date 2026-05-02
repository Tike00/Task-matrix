const PROJECT_STATUS_LABELS = {
  active: '进行中',
  paused: '已暂停',
  completed: '已完成',
  failed: '已失败',
  pending: '待开始',
  running: '进行中',
  stopped: '已停止'
};

const TASK_STATUS_LABELS = {
  pending: '待执行',
  running: '执行中',
  completed: '已完成',
  failed: '已失败',
  stopped: '已停止'
};

const LEGACY_STATUS_ALIASES = {
  '杩涜涓?': 'active',
  '杩愯涓?': 'running',
  '瀹屾垚': 'completed',
  '宸插畬鎴?': 'completed',
  '澶辫触': 'failed',
  '鍋滄': 'stopped',
  '鏆傚仠': 'paused',
  '寰呮墽琛?': 'pending'
};

export function normalizeStatus(value) {
  const raw = String(value || '').trim();
  return LEGACY_STATUS_ALIASES[raw] || raw || 'pending';
}

export function getStatusLabel(value) {
  const normalized = normalizeStatus(value);
  return (
    TASK_STATUS_LABELS[normalized] ||
    PROJECT_STATUS_LABELS[normalized] ||
    normalized ||
    '-'
  );
}

export function isRunningStatus(value) {
  const normalized = normalizeStatus(value);
  return normalized === 'active' || normalized === 'running';
}

