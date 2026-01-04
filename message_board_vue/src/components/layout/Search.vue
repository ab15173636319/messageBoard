<template>
    <div class="search-container">
        <el-input v-model="searchText" placeholder="搜索留言内容或用户名..." :disabled="isDisabled" clearable
            @keyup.enter="handleSearch" @clear="handleClear">
            <template #prefix>
                <el-icon>
                    <Search />
                </el-icon>
            </template>
        </el-input>
        <el-button type="primary" @click="handleSearch" icon="Search" :disabled="isDisabled">
            搜索
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps<{
    disabled?: boolean
}>()

const emit = defineEmits<{
    (e: 'search', keyword: string): void
    (e: 'clear'): void
}>()

const searchText = ref('')

const isDisabled = computed(() => {
    return props.disabled || false
})

const handleSearch = () => {
    emit('search', searchText.value.trim())
}

const handleClear = () => {
    searchText.value = ''
    emit('clear')
}
</script>

<style scoped>
@reference "../../App.css";

.search-container {
    @apply flex items-center gap-2 mb-4;
}

.search-container :deep(.el-input) {
    @apply flex-1;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .search-container {
        @apply flex-col gap-2;
    }

    .search-container :deep(.el-input) {
        @apply w-full;
    }

    .search-container :deep(.el-button) {
        @apply w-full;
    }
}
</style>