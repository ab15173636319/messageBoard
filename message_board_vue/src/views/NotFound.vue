<template>
    <div class="not-found-view">
        <div class="not-found-container">
            <div class="error-content">
                <div class="error-number">404</div>
                <div class="error-title">页面未找到</div>
                <div class="error-description">
                    抱歉，您访问的页面不存在或已被移除
                </div>
                <div class="error-actions">
                    <el-button type="primary" @click="goHome" size="large">
                        返回首页
                    </el-button>
                    <el-button @click="goBack" size="large">
                        返回上一页
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push({ name: 'Home' });

};

const goBack = () => {
    router.go(-1);
};
</script>

<style scoped>
@reference "../App.css";

.not-found-view {
    @apply min-h-screen bg-white flex items-center justify-center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.not-found-container {
    @apply max-w-2xl mx-auto px-4 py-8;
}

.error-content {
    @apply text-center bg-white rounded-2xl shadow-2xl p-8 md:p-12;
    animation: fadeInUp 0.6s ease-out;
}

.error-number {
    @apply text-8xl md:text-9xl font-bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: 1rem;
}

.error-title {
    @apply text-3xl md:text-4xl font-semibold text-gray-800 mb-4;
}

.error-description {
    @apply text-lg text-gray-600 mb-8;
}

.error-actions {
    @apply flex flex-col sm:flex-row gap-4 justify-center items-center;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 移动端适配 */
@media (max-width: 640px) {
    .error-content {
        @apply p-6;
    }

    .error-number {
        @apply text-6xl;
    }

    .error-title {
        @apply text-2xl;
    }

    .error-description {
        @apply text-base;
    }
}
</style>
