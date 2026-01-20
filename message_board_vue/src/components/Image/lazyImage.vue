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
import { computed } from "vue";
import Image from "./Image.vue";
import type { aspectRatio } from ".";

const props = defineProps<{
    src: string;
    size?: number | string;
    width?: string | number;
    height?: string | number;
    delay?: number | string;
    timeout?: number | string;
    aspectRatio?: aspectRatio;
}>();

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
    } else {
        throw new Error("设置比列前必须先设置宽或高");
    }
    return width + "px";
});

const setHeight = computed(() => {
    let width = Number(props.width) || Number(props.size);
    let height = props.height || Number(props.size) || 100;
    if (props.aspectRatio && arComputed.value && width) {
        height = width / arComputed.value;
    } else {
        throw new Error("设置比列前必须先设置宽或高");
    }
    return height + "px";
});

const setSeletonWidth = computed(() => {
    let width = Number(props.width) || Number(props.size) || 100;
    let height = Number(props.height) || Number(props.size);
    if (props.aspectRatio && arComputed.value && props.height) {
        width = height / arComputed.value;
    } else {
        throw new Error("设置比列前必须先设置宽或高");
    }
    return width * 0.3 + "px";
});

const setSeletonRight = computed(() => {
    let width = Number(props.width) || Number(props.size) || 100;
    let height = props.height || Number(props.size);
    if (props.aspectRatio && arComputed.value && height) {
        height = width / arComputed.value;
    } else {
        throw new Error("设置比列前必须先设置宽或高");
    }
    return -width * 0.3 + "px";
});

const setSeletonAfterRight = computed(() => {
    let width = Number(props.width) || Number(props.size) || 100;
    let height = Number(props.height) || Number(props.size);
    if (props.aspectRatio && arComputed.value && height) {
        width = height / arComputed.value;
    } else {
        throw new Error("设置比列前必须先设置宽或高");
    }
    return width + width * 0.3 + "px";
});
</script>

<style scoped>
.image {
    border-radius: 10px;
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
