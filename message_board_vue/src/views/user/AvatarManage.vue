<template>
    <div class="avatar-manage">
        <div class="header">
            <h2 class="title">头像管理</h2>
            <p class="desc">上传或更换您的头像</p>
        </div>
        <div class="content" v-loading="userStore.loading">
            <div class="avatar-upload">
                <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeUpload">
                    <!-- <el-avatar v-if="avatarUrl" :size="120" :src="avatarUrl" /> -->
                    <LazyImage v-if="avatarUrl" :src="avatarUrl" :height="100" shape="circle" aspect-ratio="1:1"
                        :delay="1" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
                <div class="tips">
                    <!-- <p>支持 JPG、PNG 格式，大小不超过 2MB</p> -->
                    <p>暂时只支持上传链接，文件上传敬请期待...</p>
                </div>
                <el-input v-model="avatarUrl" type="text" placeholder="请输入头像URL" />
                <el-button type="primary" @click="handleSave" :loading="loading">
                    保存头像
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 目前只支持上传链接，上传文件敬请期待！
 */
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/modules/user";
import { useFileStore } from "@/stores/modules/file";
import randomName from "@/utils/randomName";
import LazyImage from "@/components/Image/lazyImage.vue";
const userStore = useUserStore();
const fileStore = useFileStore();
const avatarUrl = ref(userStore.userInfo?.avatar || "");
const selectFile = ref<File>();
const loading = ref(false);

const beforeUpload = (file: File) => {
    loading.value = true;
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 5;

    if (!isImage) {
        ElMessage.error("只能上传图片文件!");
        return false;
    }
    if (!isLt2M) {
        ElMessage.error("图片大小不能超过 5MB!");
        return false;
    }

    // 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
        avatarUrl.value = e.target?.result as string;
    };

    selectFile.value = file;
    loading.value = false;
    reader.readAsDataURL(file);
    return false;
};

const handleSave = async () => {
    if (!selectFile.value && !avatarUrl.value) {
        ElMessage.warning("请先选择头像");
        return;
    }
    try {
        // TODO: 调用上传头像API
        loading.value = true;
        let url = "";
        if (selectFile.value) {
            const res = await fileStore.uploadFile({
                file: selectFile.value,
                fileName: "avatar" + userStore.userInfo?.username + randomName(),
            });
            url = res.data.fileData.path;
        }
        if (url || avatarUrl.value) {
            await userStore.updateAvatar(url || avatarUrl.value);
        }
    } catch (error) {
        ElMessage.error("头像设置失败");
        console.error("更新头像失败:", error);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
@reference "../../App.css";

.avatar-manage {
    @apply w-full h-full p-6 bg-white rounded-lg shadow-md;
}

.header {
    @apply mb-6 pb-4 border-b border-gray-200;
}

.title {
    @apply text-2xl font-bold text-gray-800 mb-2;
}

.desc {
    @apply text-gray-500;
}

.content {
    @apply flex items-center justify-center min-h-[400px];
}

.avatar-upload {
    @apply flex flex-col items-center gap-4;
}

.avatar-uploader {
    @apply border-2 border-dashed border-gray-300 rounded-full p-4 cursor-pointer flex justify-center items-center;
    @apply hover:border-blue-500 transition-colors;
}

:deep(.avatar-uploader-icon) {
    @apply text-4xl text-gray-400;
}

.tips {
    @apply text-sm text-gray-500;
}

.tips p {
    @apply mb-0;
}
</style>
