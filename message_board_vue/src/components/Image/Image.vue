<template>
    <img :style="{ '--width': setWidth, '--height': setHeight }" :src="src" alt="" />
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import type { aspectRatio } from ".";

const props = defineProps<{
    src: string;
    size?: number | string;
    width?: number | string;
    height?: number | string;
    delay?: number | string;
    timeout?: number | string;
    aspectRatio?: aspectRatio;
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

const arComputed = computed((): number => {
    if (!props.aspectRatio) return 0;
    const [width, height] = props.aspectRatio?.split(":").map(Number);
    return width! / height!;
});

const setWidth = computed(() => {
    let width = Number(props.width) || Number(props.size) || 100;
    let height = Number(props.height) || Number(props.size);
    console.log(props.aspectRatio, arComputed.value, height);

    if (props.aspectRatio && arComputed.value && height) {
        width = height / arComputed.value;
    }

    return width + "px";
});

const setHeight = computed(() => {
    let width = Number(props.width) || Number(props.size);
    let height = props.height || Number(props.size) || 100;
    if (props.aspectRatio && arComputed.value && width) {
        height = width / arComputed.value;
    }
    return height + "px";
});
</script>
<style scoped>
img {
    width: var(--width);
    height: var(--height);
    object-fit: cover;
}
</style>
