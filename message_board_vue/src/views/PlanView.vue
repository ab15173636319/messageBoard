<template>
    <div class="plan-view">
        <div class="content-container">
            <!-- 页面标题 -->
            <div class="page-header">
                <h1 class="page-title">开发计划</h1>
                <p class="page-subtitle">项目功能开发进度和计划</p>
            </div>

            <!-- 开发计划列表 -->
            <div class="plans-grid">
                <!-- 已完成 -->
                <div class="plan-section">
                    <div class="section-header completed">
                        <el-icon class="section-icon">
                            <CircleCheck />
                        </el-icon>
                        <h2 class="section-title">已完成</h2>
                        <span class="section-count">{{ completedPlans.length }}</span>
                    </div>
                    <div class="plans-list">
                        <div v-for="plan in completedPlans" :key="plan.id" class="plan-card completed">
                            <div class="plan-header">
                                <h3 class="plan-name">{{ plan.name }}</h3>
                                <el-tag type="success" size="small">已完成</el-tag>
                            </div>
                            <p class="plan-description">{{ plan.description }}</p>
                            <div class="plan-meta">
                                <span class="plan-date">{{ plan.date }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 进行中 -->
                <div class="plan-section">
                    <div class="section-header in-progress">
                        <el-icon class="section-icon">
                            <Loading />
                        </el-icon>
                        <h2 class="section-title">进行中</h2>
                        <span class="section-count">{{ inProgressPlans.length }}</span>
                    </div>
                    <div class="plans-list">
                        <div v-for="plan in inProgressPlans" :key="plan.id" class="plan-card in-progress">
                            <div class="plan-header">
                                <h3 class="plan-name">{{ plan.name }}</h3>
                                <el-tag type="warning" size="small">进行中</el-tag>
                            </div>
                            <p class="plan-description">{{ plan.description }}</p>
                            <div class="plan-meta">
                                <span class="plan-date">{{ plan.date }}</span>
                                <el-progress :percentage="plan.progress || 0" :stroke-width="6"
                                    :show-text="true"></el-progress>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 计划中 -->
                <div class="plan-section">
                    <div class="section-header planned">
                        <el-icon class="section-icon">
                            <Clock />
                        </el-icon>
                        <h2 class="section-title">计划中</h2>
                        <span class="section-count">{{ plannedPlans.length }}</span>
                    </div>
                    <div class="plans-list">
                        <div v-for="plan in plannedPlans" :key="plan.id" class="plan-card planned">
                            <div class="plan-header">
                                <h3 class="plan-name">{{ plan.name }}</h3>
                                <el-tag type="info" size="small">计划中</el-tag>
                            </div>
                            <p class="plan-description">{{ plan.description }}</p>
                            <div class="plan-meta">
                                <span class="plan-date">{{ plan.date }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Navigation from "@/components/layout/Navigation.vue";
import { CircleCheck, Loading, Clock } from "@element-plus/icons-vue";

interface PlanItem {
    id: string;
    name: string;
    description: string;
    date: string;
    status: "completed" | "in-progress" | "planned";
    progress?: number;
}

// 开发计划数据
const plans: PlanItem[] = [
    {
        id: "1",
        name: "用户登录注册功能",
        description: "实现用户登录、注册页面，包含表单验证和用户认证功能",
        date: "2025-01-01",
        status: "completed",
    },
    {
        id: "2",
        name: "留言板列表展示",
        description: "实现留言列表的展示，支持分页和筛选功能",
        date: "2025-01-02",
        status: "completed",
    },
    {
        id: "3",
        name: "留言详情页面",
        description: "实现留言详情页，展示留言内容和回复列表",
        date: "2025-01-03",
        status: "completed",
    },
    {
        id: "4",
        name: "富文本编辑器",
        description: "集成富文本编辑器，支持表情、格式化等功能",
        date: "2025-01-04",
        status: "completed",
    },
    {
        id: "5",
        name: "响应式布局优化",
        description: "优化移动端适配，确保在不同设备上良好显示",
        date: "2025-01-05",
        status: "completed",
    },
    {
        id: "6",
        name: "数据持久化",
        description: "实现后端API接口，完成数据持久化存储（MongoDB）",
        date: "2025-01-06",
        status: "completed",
    },
    {
        id: "7",
        name: "留言回复功能",
        description: "实现留言回复功能，支持添加、编辑、删除回复，包含用户信息关联",
        date: "2025-01-07",
        status: "completed",
    },
    {
        id: "8",
        name: "留言点赞功能",
        description: "实现留言点赞功能，支持点赞、取消点赞和点赞状态查询",
        date: "2025-01-08",
        status: "completed",
    },
    {
        id: "9",
        name: "用户信息关联",
        description: "在查询消息和回复时自动关联用户信息（昵称、头像、UID）",
        date: "2025-01-09",
        status: "completed",
    },
    {
        id: "10",
        name: "用户个人中心",
        description: "实现用户个人中心页面，包含个人信息、留言管理等功能",
        date: "2025-01-10",
        status: "in-progress",
        progress: 80,
    },
    {
        id: "11",
        name: "留言搜索功能",
        description: "实现留言搜索功能，支持关键词搜索和高级筛选",
        date: "2025-01-15",
        status: "completed",
    },
    {
        id: "12",
        name: "回复通知功能",
        description: "实现回复通知功能，当用户收到回复时发送通知",
        date: "2025-01-20",
        status: "completed",
    },
    {
        id: "13",
        name: "嵌套回复功能",
        description: "支持回复的回复，实现多级嵌套回复结构",
        date: "2025-01-25",
        status: "planned",
    },
    {
        id: "14",
        name: "用户权限管理",
        description: "实现用户权限管理，支持管理员功能",
        date: "2025-02-01",
        status: "completed",
    },
    {
        id: "15",
        name: "性能优化",
        description: "优化页面加载速度，实现懒加载和代码分割",
        date: "2025-02-05",
        status: "planned",
    },
    {
        id: "16",
        name: "文件上传功能",
        description: "实现图片和文件上传功能，支持OSS存储",
        date: "2025-02-10",
        status: "completed",
    },
];

// 按状态分类
const completedPlans = computed(() =>
    plans.filter((plan) => plan.status === "completed"),
);

const inProgressPlans = computed(() =>
    plans.filter((plan) => plan.status === "in-progress"),
);

const plannedPlans = computed(() =>
    plans.filter((plan) => plan.status === "planned"),
);
</script>

<style scoped>
@reference "../App.css";

.plan-view {
    @apply min-h-screen bg-white;
}

.content-container {
    @apply max-w-7xl mx-auto px-4 py-8;
}

/* 页面标题 */
.page-header {
    @apply mb-8 text-center;
}

.page-title {
    @apply text-3xl font-bold text-gray-800 mb-2;
}

.page-subtitle {
    @apply text-gray-600;
}

/* 计划网格 */
.plans-grid {
    @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
}

/* 计划分类区域 */
.plan-section {
    @apply flex flex-col;
}

.section-header {
    @apply flex items-center gap-3 mb-4 p-4 rounded-xl;
    @apply bg-white/80 backdrop-blur-xl;
    @apply border border-gray-200/50 shadow-sm;
}

.section-header.completed {
    @apply border-green-200 bg-green-50/50;
}

.section-header.in-progress {
    @apply border-orange-200 bg-orange-50/50;
}

.section-header.planned {
    @apply border-blue-200 bg-blue-50/50;
}

.section-icon {
    @apply text-2xl;
}

.section-header.completed .section-icon {
    @apply text-green-600;
}

.section-header.in-progress .section-icon {
    @apply text-orange-600;
}

.section-header.planned .section-icon {
    @apply text-blue-600;
}

.section-title {
    @apply text-lg font-bold text-gray-800 flex-1;
}

.section-count {
    @apply px-2 py-1 rounded-full text-xs font-medium;
    @apply bg-white/80 backdrop-blur-sm;
}

.section-header.completed .section-count {
    @apply text-green-700 bg-green-100;
}

.section-header.in-progress .section-count {
    @apply text-orange-700 bg-orange-100;
}

.section-header.planned .section-count {
    @apply text-blue-700 bg-blue-100;
}

/* 计划列表 */
.plans-list {
    @apply space-y-3 flex-1;
}

/* 计划卡片 */
.plan-card {
    @apply bg-white/80 backdrop-blur-xl rounded-xl p-4;
    @apply border border-gray-200/50 shadow-sm;
    transition: all 0.3s ease;
}

.plan-card:hover {
    @apply shadow-md bg-white/90;
}

.plan-card.completed {
    @apply border-green-200/50;
}

.plan-card.in-progress {
    @apply border-orange-200/50;
}

.plan-card.planned {
    @apply border-blue-200/50;
}

.plan-header {
    @apply flex items-center justify-between mb-2;
}

.plan-name {
    @apply text-base font-semibold text-gray-800 flex-1;
}

.plan-description {
    @apply text-sm text-gray-600 leading-relaxed mb-3;
    @apply line-clamp-2;
}

.plan-meta {
    @apply flex flex-col gap-2;
}

.plan-date {
    @apply text-xs text-gray-500;
}

/* 进度条样式 */
:deep(.el-progress) {
    @apply mt-2;
}

:deep(.el-progress-bar__outer) {
    @apply bg-gray-100;
}

/* 移动端适配 */
@media (max-width: 1024px) {
    .plans-grid {
        @apply grid-cols-1;
    }

    .content-container {
        @apply px-3 py-6;
    }
}

@media (max-width: 768px) {
    .content-container {
        @apply px-2 py-4;
    }

    .page-title {
        @apply text-2xl;
    }

    .page-subtitle {
        @apply text-sm;
    }

    .section-header {
        @apply p-3;
    }

    .section-icon {
        @apply text-xl;
    }

    .section-title {
        @apply text-base;
    }

    .plan-card {
        @apply p-3;
    }

    .plan-name {
        @apply text-sm;
    }

    .plan-description {
        @apply text-xs;
    }
}
</style>
