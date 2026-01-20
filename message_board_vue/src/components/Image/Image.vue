<template>
    <img :style="{
        '--width': setWidth,
        '--height': setHeight,
        'border-radius': rounded,
    }" :src="src" alt="" />
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import type { AspectRatio, ILazyImage } from "..";

const props = defineProps<ILazyImage>();

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

const rounded = computed(() => {
    switch (props.shape) {
        case "circle":
            return "50%";
        case "square":
            return "0";
        case "roundRect":
            return "10px";
        default:
            return "10px";
    }
});
</script>
<style scoped>
img {
    width: var(--width);
    height: var(--height);
    object-fit: cover;
}
</style>
