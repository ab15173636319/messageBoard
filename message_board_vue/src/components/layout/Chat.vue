<script setup lang="ts">
import {
    ref,
    watch,
    onMounted,
    onBeforeUnmount,
    nextTick,
    computed,
} from "vue";
import { emoji, emojiCategories } from "@/config/emoji";

interface Props {
    modelValue?: string;
    placeholder?: string;
    minHeight?: string;
    maxHeight?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    placeholder: "请输入内容...",
    minHeight: "120px",
    maxHeight: "auto",
});

const emit = defineEmits<{
    "update:modelValue": [value: string];
}>();

const editorRef = ref<HTMLDivElement | null>(null);
const isComposing = ref(false);
const isEmpty = ref(true);
const showEmojiPanel = ref(false);
const activeEmojiTab = ref<"happy" | "sad" | "angry" | "surprised" | "other">(
    "happy",
);

// 表情分类标签
const emojiTabs = [
    { key: "happy" as const, label: "开心", icon: "😊" },
    { key: "sad" as const, label: "难过", icon: "😢" },
    { key: "angry" as const, label: "生气", icon: "😠" },
    { key: "surprised" as const, label: "惊讶", icon: "😲" },
    { key: "other" as const, label: "其他", icon: "😎" },
];

// 当前分类的表情列表
const currentEmojis = computed(() => {
    return emojiCategories[activeEmojiTab.value] || [];
});

// 更新内容
const updateContent = () => {
    if (!editorRef.value || isComposing.value) return;

    const content = editorRef.value.innerHTML;
    const text = editorRef.value.innerText || editorRef.value.textContent || "";
    isEmpty.value = !text.trim();
    emit("update:modelValue", content);
};

// 格式化命令
const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.value?.focus();
    updateContent();
};

// 插入文本
const insertText = (text: string) => {
    if (!editorRef.value) return;

    // 强制将焦点设置到编辑区域
    editorRef.value.focus();

    // 稍等片刻确保焦点已切换
    nextTick(() => {
        if (!editorRef.value) return;

        const selection = window.getSelection();
        let range: Range;

        if (selection && selection.rangeCount > 0) {
            range = selection.getRangeAt(0);

            // 检查选择范围是否在编辑区域内
            const isInEditor = editorRef.value.contains(
                range.commonAncestorContainer,
            );

            if (!isInEditor) {
                // 如果不在编辑区域内，创建新的范围到编辑区域末尾
                range = document.createRange();
                range.selectNodeContents(editorRef.value);
                range.collapse(false);
            }
        } else {
            // 如果没有选择，创建范围到编辑区域末尾
            range = document.createRange();
            range.selectNodeContents(editorRef.value);
            range.collapse(false);
        }

        // 插入文本
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // 将光标移动到插入的文本之后
        range.setStartAfter(textNode);
        range.collapse(true);

        // 更新选择
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }

        updateContent();
        editorRef.value.focus();
    });
};

// 插入表情
const insertEmoji = (emojiText: string) => {
    insertText(emojiText);
    showEmojiPanel.value = false;
};

// 切换表情面板
const toggleEmojiPanel = () => {
    showEmojiPanel.value = !showEmojiPanel.value;
};

// 切换表情分类
const switchEmojiTab = (tab: typeof activeEmojiTab.value) => {
    activeEmojiTab.value = tab;
};

// 点击外部关闭表情面板
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".emoji-panel") && !target.closest(".emoji-btn")) {
        showEmojiPanel.value = false;
    }
};

// 监听外部值变化
watch(
    () => props.modelValue,
    (newValue) => {
        if (editorRef.value && editorRef.value.innerHTML !== newValue) {
            editorRef.value.innerHTML = newValue || "";
            const text =
                editorRef.value.innerText || editorRef.value.textContent || "";
            isEmpty.value = !text.trim();
        }
    },
    { immediate: true },
);

// 处理输入事件
const handleInput = () => {
    if (!isComposing.value) {
        updateContent();
    }
};

// 处理组合输入（中文输入法）
const handleCompositionStart = () => {
    isComposing.value = true;
};

const handleCompositionEnd = () => {
    isComposing.value = false;
    nextTick(() => {
        updateContent();
    });
};

// 处理粘贴事件，清理格式
const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain") || "";
    insertText(text);
};

// 获取纯文本内容
const getPlainText = (): string => {
    if (!editorRef.value) return "";
    return editorRef.value.innerText || editorRef.value.textContent || "";
};

// 获取HTML内容
const getHTML = (): string => {
    if (!editorRef.value) return "";
    return editorRef.value.innerHTML;
};

// 清空内容
const clear = () => {
    if (editorRef.value) {
        editorRef.value.innerHTML = "";
        isEmpty.value = true;
        updateContent();
    }
};

// 暴露方法给父组件
defineExpose({
    clear,
    getPlainText,
    getHTML,
    focus: () => editorRef.value?.focus(),
    blur: () => editorRef.value?.blur(),
});

onMounted(() => {
    if (editorRef.value) {
        editorRef.value.innerHTML = props.modelValue || "";
        const text = editorRef.value.innerText || editorRef.value.textContent || "";
        isEmpty.value = !text.trim();
    }

    // 监听点击外部关闭表情面板
    document.addEventListener("click", handleClickOutside);
});

// 组件卸载时移除事件监听
onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
    <div class="rich-text-editor">
        <!-- 工具栏 -->
        <div class="toolbar">
            <button type="button" class="toolbar-btn" @click="execCommand('bold')" title="加粗 (Ctrl+B)">
                <strong>B</strong>
            </button>
            <button type="button" class="toolbar-btn" @click="execCommand('italic')" title="斜体 (Ctrl+I)">
                <em>I</em>
            </button>
            <button type="button" class="toolbar-btn" @click="execCommand('underline')" title="下划线 (Ctrl+U)">
                <u>U</u>
            </button>
            <div class="toolbar-divider"></div>
            <button type="button" class="toolbar-btn" @click="execCommand('insertUnorderedList')" title="无序列表">
                <span>• 列表</span>
            </button>
            <button type="button" class="toolbar-btn" @click="execCommand('insertOrderedList')" title="有序列表">
                <span>1. 列表</span>
            </button>
            <div class="toolbar-divider"></div>
            <button type="button" class="toolbar-btn" @click="execCommand('justifyLeft')" title="左对齐">
                <span>⬅</span>
            </button>
            <button type="button" class="toolbar-btn" @click="execCommand('justifyCenter')" title="居中">
                <span>⬌</span>
            </button>
            <button type="button" class="toolbar-btn" @click="execCommand('justifyRight')" title="右对齐">
                <span>➡</span>
            </button>
            <div class="toolbar-divider"></div>
            <div class="emoji-btn-wrapper">
                <button type="button" class="toolbar-btn emoji-btn" :class="{ active: showEmojiPanel }"
                    @click.stop="toggleEmojiPanel" title="表情">
                    <span>😊 表情</span>
                </button>
                <!-- 表情面板 -->
                <div v-if="showEmojiPanel" class="emoji-panel" @click.stop>
                    <div class="emoji-tabs">
                        <button v-for="tab in emojiTabs" :key="tab.key" type="button" class="emoji-tab"
                            :class="{ active: activeEmojiTab === tab.key }" @click="switchEmojiTab(tab.key)">
                            <span class="emoji-tab-icon">{{ tab.icon }}</span>
                            <span class="emoji-tab-label">{{ tab.label }}</span>
                        </button>
                    </div>
                    <div class="emoji-list">
                        <button v-for="item in currentEmojis" :key="item.name" type="button" class="emoji-item"
                            :title="item.name" @click="insertEmoji(item.emoji)">
                            {{ item.emoji }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="toolbar-divider"></div>
            <button type="button" class="toolbar-btn" @click="clear" title="清空">
                <span>清空</span>
            </button>
        </div>

        <!-- 编辑区域 -->
        <div ref="editorRef" class="editor-content" :class="{ 'is-empty': isEmpty }" contenteditable="true"
            :data-placeholder="placeholder" :style="{
                minHeight: minHeight,
                maxHeight: maxHeight,
            }" @input="handleInput" @paste="handlePaste" @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"></div>

        <!-- 字数统计（可选） -->
        <div class="editor-footer">
            <span class="char-count">{{ getPlainText().length }} 字</span>
        </div>
    </div>
</template>

<style scoped>
@reference "../../App.css";

.rich-text-editor {
    @apply border border-gray-300 rounded-lg overflow-hidden w-full;
    @apply bg-white;
    transition: all 0.3s ease;
}

.rich-text-editor:focus-within {
    @apply border-blue-500 shadow-md;
}

.toolbar {
    @apply flex items-center gap-1 px-2 py-2 border-b border-gray-200;
    @apply bg-gray-50 flex-wrap;
}

.toolbar-btn {
    @apply px-3 py-1.5 rounded text-sm font-medium;
    @apply text-gray-700 bg-white border border-gray-300;
    @apply hover:bg-gray-100 hover:border-gray-400;
    @apply active:bg-gray-200 transition-colors duration-200;
    @apply cursor-pointer;
    min-width: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.toolbar-btn strong {
    @apply font-bold;
}

.toolbar-btn em {
    @apply italic;
}

.toolbar-btn u {
    @apply underline;
}

.toolbar-divider {
    @apply w-px h-6 bg-gray-300 mx-1;
}

/* 表情按钮和面板 */
.emoji-btn-wrapper {
    @apply relative;
}

.emoji-btn.active {
    @apply bg-blue-100 border-blue-400;
}

.emoji-panel {
    @apply absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50;
    @apply w-80 max-h-96 flex flex-col;
}

.emoji-tabs {
    @apply flex border-b border-gray-200 bg-gray-50 rounded-t-lg;
}

.emoji-tab {
    @apply flex-1 px-2 py-2 text-xs font-medium text-gray-700;
    @apply hover:bg-gray-100 transition-colors duration-200;
    @apply flex flex-col items-center gap-1;
    border: none;
    background: transparent;
    cursor: pointer;
}

.emoji-tab.active {
    @apply bg-white text-blue-600 border-b-2 border-blue-600;
}

.emoji-tab-icon {
    @apply text-lg;
}

.emoji-tab-label {
    @apply text-xs;
}

.emoji-list {
    @apply p-3 overflow-y-auto flex flex-wrap gap-2;
    max-height: 250px;
}

.emoji-item {
    @apply w-8 h-8 flex items-center justify-center text-xl;
    @apply hover:bg-gray-100 rounded transition-colors duration-200;
    @apply cursor-pointer;
    border: none;
    background: transparent;
    font-size: 24px;
    line-height: 1;
}

.emoji-item:hover {
    @apply bg-blue-50 scale-110;
    transform: scale(1.1);
}

.editor-content {
    @apply px-4 py-3 outline-none overflow-y-auto;
    @apply text-gray-800 leading-relaxed;
    word-wrap: break-word;
    word-break: break-word;
}

.editor-content:focus {
    @apply outline-none;
}

.editor-content.is-empty:before {
    content: attr(data-placeholder);
    @apply text-gray-400 pointer-events-none;
    position: absolute;
}

.editor-content :deep(p) {
    @apply mb-2;
    min-height: 1.5em;
}

.editor-content :deep(p:last-child) {
    @apply mb-0;
}

.editor-content :deep(ul),
.editor-content :deep(ol) {
    @apply ml-6 mb-2;
}

.editor-content :deep(li) {
    @apply mb-1;
}

.editor-content :deep(strong),
.editor-content :deep(b) {
    @apply font-bold;
}

.editor-content :deep(em),
.editor-content :deep(i) {
    @apply italic;
}

.editor-content :deep(u) {
    @apply underline;
}

.editor-content :deep(h1),
.editor-content :deep(h2),
.editor-content :deep(h3) {
    @apply font-bold mb-2 mt-3;
}

.editor-content :deep(h1) {
    @apply text-2xl;
}

.editor-content :deep(h2) {
    @apply text-xl;
}

.editor-content :deep(h3) {
    @apply text-lg;
}

.editor-footer {
    @apply px-4 py-2 border-t border-gray-200;
    @apply bg-gray-50 flex justify-end;
}

.char-count {
    @apply text-xs text-gray-500;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .rich-text-editor {
        @apply rounded-lg;
    }

    .toolbar {
        @apply px-1 py-1.5 gap-0.5;
        @apply overflow-x-auto;
    }

    .toolbar-btn {
        @apply px-2 py-1.5 text-xs;
        min-width: auto;
        @apply shrink-0;
        white-space: nowrap;
    }

    /* 只隐藏图标按钮中的文字，保留功能按钮文字 */
    .toolbar-btn strong,
    .toolbar-btn em,
    .toolbar-btn u {
        @apply block;
    }

    .toolbar-divider {
        @apply h-4 mx-0.5;
    }

    .editor-content {
        @apply px-3 py-2.5 text-sm;
        @apply min-h-[100px];
    }

    .editor-footer {
        @apply px-3 py-1.5;
    }

    .char-count {
        @apply text-xs;
    }

    /* 表情面板移动端优化 */
    .emoji-panel {
        @apply w-[calc(100vw-2rem)] max-w-none;
        @apply left-1/2 transform -translate-x-1/2;
    }

    .emoji-tabs {
        @apply overflow-x-auto;
    }

    .emoji-tab {
        @apply px-2 py-1.5 shrink-0;
        min-width: 60px;
    }

    .emoji-tab-icon {
        @apply text-base;
    }

    .emoji-tab-label {
        @apply hidden;
    }

    .emoji-list {
        @apply p-2 gap-1.5;
        max-height: 200px;
    }

    .emoji-item {
        @apply w-8 h-8;
        font-size: 22px;
    }
}

/* 小屏幕手机适配 */
@media (max-width: 480px) {
    .toolbar {
        @apply px-1 py-1.5;
    }

    .toolbar-btn {
        @apply px-2 py-1;
        min-width: auto;
        @apply text-xs;
    }

    /* 小屏幕时缩短文字 */
    .toolbar-btn span {
        @apply text-xs;
    }

    .editor-content {
        @apply px-2 py-2 text-sm;
    }

    .emoji-panel {
        @apply w-[calc(100vw-1rem)];
    }

    .emoji-item {
        @apply w-7 h-7;
        font-size: 20px;
    }
}
</style>
