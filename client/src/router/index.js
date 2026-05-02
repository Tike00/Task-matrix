import { createRouter, createWebHistory } from 'vue-router';
import { getToken } from '../utils/auth';

import LoginView from '../views/LoginView.vue';
import ChangePasswordView from '../views/ChangePasswordView.vue';
import DashboardView from '../views/DashboardView.vue';
import ProjectListView from '../views/ProjectListView.vue';
import ProjectCreateView from '../views/ProjectCreateView.vue';
import ProjectDesignView from '../views/ProjectDesignView.vue';
import ProjectExecutionView from '../views/ProjectExecutionView.vue';
import TaskTemplateView from '../views/TaskTemplateView.vue';
import ReportView from '../views/ReportView.vue';
import SettingsView from '../views/SettingsView.vue';
import AuditLogView from '../views/AuditLogView.vue';
import ScriptRunnerView from '../views/ScriptRunnerView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: ChangePasswordView
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectListView
  },
  {
    path: '/projects/new',
    name: 'project-create',
    component: ProjectCreateView
  },
  {
    path: '/projects/:id',
    redirect: (to) => `/projects/${to.params.id}/design`
  },
  {
    path: '/projects/:id/design',
    name: 'project-design',
    component: ProjectDesignView
  },
  {
    path: '/projects/:id/execution',
    name: 'project-execution',
    component: ProjectExecutionView
  },
  {
    path: '/task-templates',
    name: 'task-templates',
    component: TaskTemplateView
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportView
  },
  {
    path: '/audit-logs',
    name: 'audit-logs',
    component: AuditLogView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path: '/script-runner',
    name: 'script-runner',
    component: ScriptRunnerView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { public: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.public) {
    next();
    return;
  }

  const token = getToken();
  if (!token) {
    next('/login');
    return;
  }

  next();
});

export default router;
