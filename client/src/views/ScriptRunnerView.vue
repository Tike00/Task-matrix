<template>
  <AppLayout>
    <PageContainer
      title="脚本调试"
      description="配置目标脱敏、并发数量、允许执行的命令，上传 Python 脚本并运行调试命令。"
    >
      <div class="script-runner-page">
        <el-card>
          <template #header>
            <div class="panel-title">运行配置</div>
          </template>

          <el-form label-width="160px">
            <el-form-item label="固定目标 URL">
              <el-input
                v-model="fixedTargetUrl"
                placeholder="http://abc.local"
              />
            </el-form-item>

            <el-form-item label="脱敏占位符">
              <el-input
                v-model="placeholderText"
                placeholder="testtest123"
              />
              <div class="form-tip">命令里填写这个占位符，后端执行前会替换成固定目标，输出结果再脱敏回这个值。</div>
            </el-form-item>

            <el-form-item label="最大并发数">
              <el-input-number v-model="maxThreads" :min="1" :max="64" />
            </el-form-item>

            <el-form-item label="允许的命令">
              <el-input
                v-model="allowedCommandsText"
                type="textarea"
                :rows="3"
                placeholder="python, python3, nmap"
              />
              <div class="form-tip">留空表示不限制。填写后仅校验命令名称，例如 python、nmap。</div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSaveConfig">保存配置</el-button>
              <el-tag :type="runnerStatus.running ? 'warning' : 'success'">
                正在运行 {{ runnerStatus.running_count }} / {{ maxThreads }}
              </el-tag>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card>
          <template #header>
            <div class="panel-title">运行中的命令</div>
          </template>

          <el-table :data="runnerStatus.running_commands" border empty-text="暂无运行中的命令">
            <el-table-column prop="id" label="ID" min-width="190" />
            <el-table-column prop="pid" label="PID" width="100" />
            <el-table-column prop="command_used" label="命令" min-width="280" />
            <el-table-column prop="started_at" label="开始时间" min-width="190" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="danger" link @click="handleStopCommand(row)">停止</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card>
          <template #header>
            <div class="panel-title">上传 Python 脚本</div>
          </template>

          <el-form label-width="160px">
            <el-form-item label="脚本文件名">
              <el-input v-model="scriptFilename" placeholder="scan.py" />
            </el-form-item>

            <el-form-item label="脚本内容">
              <el-input
                v-model="scriptContent"
                type="textarea"
                :rows="8"
                placeholder="Python 源码"
              />
              <div class="form-tip">脚本可以用 <code>-u</code> 参数接收目标，执行命令时传入配置好的占位符即可。</div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleUploadScript">上传脚本</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card>
          <template #header>
            <div class="panel-title">执行命令</div>
          </template>

          <div class="tips">
            命令里使用脱敏占位符。后端执行前会替换为固定目标，输出结果会再脱敏回占位符。
            示例：<code>python scan.py -u {{ placeholderText || 'testtest123' }}</code>
          </div>

          <el-form label-width="120px">
            <el-form-item label="命令">
              <el-input
                v-model="commandText"
                type="textarea"
                :rows="5"
                placeholder="python scan.py -u testtest123"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="executing" @click="handleExecute">执行</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card>
          <template #header>
            <div class="panel-title">最近一次结果</div>
          </template>

          <el-descriptions v-if="result" :column="2" border>
            <el-descriptions-item label="是否成功">
              {{ result.success ? '是' : '否' }}
            </el-descriptions-item>
            <el-descriptions-item label="退出码">
              {{ result.exit_code ?? '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="开始时间">
              {{ result.started_at || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="结束时间">
              {{ result.finished_at || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="展示命令" :span="2">
              {{ result.command_used || '-' }}
            </el-descriptions-item>
          </el-descriptions>

          <div class="result-block">
            <div class="result-title">Base64 输出</div>
            <pre class="terminal-block">{{ result?.sanitized_output || '' }}</pre>
          </div>

          <div v-if="result?.message" class="result-block">
            <div class="result-title">提示信息</div>
            <pre class="terminal-block">{{ result.message }}</pre>
          </div>
        </el-card>
      </div>
    </PageContainer>
  </AppLayout>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import PageContainer from '../components/common/PageContainer.vue';
import {
  executeScriptRunnerApi,
  getScriptRunnerConfigApi,
  getScriptRunnerStatusApi,
  saveScriptRunnerConfigApi,
  stopScriptRunnerCommandApi,
  uploadPythonScriptApi
} from '../api/scriptRunner';
import { showError, showSuccess } from '../utils/message';

const fixedTargetUrl = ref('');
const placeholderText = ref('testtest123');
const maxThreads = ref(3);
const allowedCommandsText = ref('');
const commandText = ref('python scan.py -u testtest123');
const scriptFilename = ref('scan.py');
const scriptContent = ref('import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("-u", required=True)\nargs = parser.parse_args()\nprint(f"target: {args.u}")\n');
const result = ref(null);
const runnerStatus = ref({
  running: false,
  running_count: 0,
  running_commands: []
});
const executing = ref(false);
let statusTimer = null;

onMounted(async () => {
  await loadConfig();
  await loadStatus();
  statusTimer = window.setInterval(loadStatus, 3000);
});

onBeforeUnmount(() => {
  if (statusTimer) {
    window.clearInterval(statusTimer);
  }
});

async function loadConfig() {
  try {
    const res = await getScriptRunnerConfigApi();
    fixedTargetUrl.value = res.data.fixed_target_url || '';
    placeholderText.value = res.data.placeholder_text || 'testtest123';
    maxThreads.value = Number(res.data.max_threads || 3);
    allowedCommandsText.value = res.data.allowed_commands_text || '';
    applyStatus(res.data);
  } catch (error) {
    showError(error.message);
  }
}

async function loadStatus() {
  try {
    const res = await getScriptRunnerStatusApi();
    applyStatus(res.data);
  } catch (error) {
    showError(error.message);
  }
}

function applyStatus(data) {
  runnerStatus.value = {
    running: !!data.running,
    running_count: Number(data.running_count || 0),
    running_commands: data.running_commands || []
  };
}

async function handleSaveConfig() {
  try {
    await saveScriptRunnerConfigApi({
      fixed_target_url: fixedTargetUrl.value,
      placeholder_text: placeholderText.value,
      max_threads: maxThreads.value,
      allowed_commands_text: allowedCommandsText.value
    });
    showSuccess('配置已保存');
    await loadConfig();
  } catch (error) {
    showError(error.message);
  }
}

async function handleUploadScript() {
  try {
    await uploadPythonScriptApi({
      filename: scriptFilename.value,
      file_content_base64: encodeBase64Utf8(scriptContent.value)
    });
    showSuccess('Python 脚本已上传');
  } catch (error) {
    showError(error.message);
  }
}

async function handleExecute() {
  try {
    executing.value = true;
    result.value = null;

    const res = await executeScriptRunnerApi({
      command_text: encodeBase64Utf8(commandText.value)
    });

    result.value = res.data;
    showSuccess('命令执行完成');
    await loadStatus();
  } catch (error) {
    showError(error.message);
    await loadStatus();
  } finally {
    executing.value = false;
  }
}

async function handleStopCommand(row) {
  try {
    await stopScriptRunnerCommandApi(row.id);
    showSuccess('已发送停止指令');
    await loadStatus();
  } catch (error) {
    showError(error.message);
  }
}

function encodeBase64Utf8(value) {
  const bytes = new TextEncoder().encode(String(value || ''));
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return window.btoa(binary);
}
</script>

<style scoped>
.script-runner-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tips,
.form-tip {
  color: var(--text-soft);
  line-height: 1.7;
}

.tips {
  margin-bottom: 12px;
}

.form-tip {
  margin-top: 6px;
  font-size: 13px;
}

.result-block {
  margin-top: 16px;
}

.result-title {
  margin-bottom: 8px;
  font-weight: 800;
}

code {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(18, 115, 234, 0.08);
}
</style>
