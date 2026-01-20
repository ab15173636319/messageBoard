<template>
    <img :style="{ '--width': setWidth, '--height': setHeight }" :src="src" alt="" />
</template>
<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
    src: string;
    size?: number | string;
    width?: number | string;
    height?: number | string;
    delay?: number | string;
    timeout?: number | string;
    aspectRatio?: number;
}>();

const timeoutSet = computed(() => {
    let time = Number(props.timeout) || 5;
    return time * 1000;
});

const delayTime = computed(() => {
    let time = Number(props.delay) || 0.1;
    return time * 1000;
});

const loadImage = (src: string) => {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error("图片加载超时"));
        }, timeoutSet.value);

        setTimeout(() => {
            const image = new Image();
            image.src = src;
            image.onload = () => {
                clearTimeout(timeoutId);
                resolve(src);
            };
            image.onerror = () => {
                clearTimeout(timeoutId);
                reject(new Error("图片加载失败"));
            };
        }, delayTime.value);
    });
};
await loadImage(props.src);

const setWidth = computed(() => {
    let width = props.width || props.size + "px" || "100px";
    return width;
});

const setHeight = computed(() => {
    let height = props.height || props.size + "px" || "100px";
    return height;
});
</script>
<style scoped>
img {
    width: var(--width);
    height: var(--height);
    object-fit: cover;
}
</style>
