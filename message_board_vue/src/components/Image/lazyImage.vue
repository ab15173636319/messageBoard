<template>
    <div>
        <Suspense>
            <template #default>
                <div class="image">
                    <Image v-bind="{ ...props }"></Image>
                </div>
            </template>
            <template #fallback>
                <div class="skeleton"></div>
            </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import Image from "./Image.vue";
import type { AspectRatio, ILazyImage } from "..";

const props = defineProps<ILazyImage>();

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
    if (props.size !== undefined && props.size !== null) {
        width = props.size;
    }
    return width + "px";
});

const setHeight = computed(() => {
    let width = Number(props.width) || Number(props.size);
    let height = props.height || Number(props.size) || 100;
    if (props.aspectRatio && arComputed.value && width) {
        height = width / arComputed.value;
    }
    if (props.size !== undefined && props.size !== null) {
        height = props.size;
    }
    return height + "px";
});

const setSeletonWidth = computed(() => {
    let width = Number(props.width) || Number(props.size) || 100;
    let height = Number(props.height) || Number(props.size);
    if (props.aspectRatio && arComputed.value && props.height) {
        width = height / arComputed.value;
    }
    if (props.size !== undefined && props.size !== null) {
        width = props.size;
    }
    return width * 0.3 + "px";
});

const setSeletonRight = computed(() => {
    let width = Number(props.width) || Number(props.size) || 100;
    let height = props.height || Number(props.size);
    if (props.aspectRatio && arComputed.value && height) {
        width = width / arComputed.value;
    }
    if (props.size !== undefined && props.size !== null) {
        width = props.size;
    }
    return -width * 0.3 + "px";
});

const setSeletonAfterRight = computed(() => {
    let width = Number(props.width) || Number(props.size) || 100;
    let height = Number(props.height) || Number(props.size);
    if (props.aspectRatio && arComputed.value && height) {
        width = height / arComputed.value;
    }
    return width + width * 0.3 + "px";
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
.image {
    border-radius: v-bind(rounded);
    overflow: hidden;
}

.skeleton {
    width: v-bind(setWidth);
    height: v-bind(setHeight);
    background-color: #dfe4ea;
    overflow: hidden;
    position: relative;
    border-radius: 10px;
}

.skeleton::before {
    content: "";
    display: block;
    background-color: #ced6e0;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    right: v-bind(setSeletonRight);
    width: v-bind(setSeletonWidth);
    height: v-bind(setHeight);
    transform: skewX(-30deg);
    animation: ping 1s infinite ease-out;
    filter: blur(10px);
}

@keyframes ping {
    from {
        right: v-bind(setSeletonRight);
    }

    to {
        right: v-bind(setSeletonAfterRight);
    }
}
</style>
