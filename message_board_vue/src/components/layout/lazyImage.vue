<template>
    <div>
        <Suspense>
            <template #default>
                <div class="image">
                    <Image v-bind="{ ...props }" :src="cache"></Image>
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
import Image from "../base/Image.vue";

const props = defineProps<{
    src: string;
    size?: number | string;
    width?: string | number;
    height?: string | number;
    delay?: number | string;
    timeout?: number | string;
    aspectRatio?: number;
}>();

const cache = computed(() => props.src);

const setWidth = computed(() => {
    let width = props.width || Number(props.size) || 100;
    console.log(width);
    return width + "px";
});

const setHeight = computed(() => {
    let height = props.height || Number(props.size) || 100;
    return height + "px";
});

const setSeletonWidth = computed(() => {
    let width = Number(props.width) || Number(props.size) || 100;

    return width * 0.3 + "px";
});

const setSeletonRight = computed(() => {
    let width = Number(props.width) || Number(props.size) || 100;
    return -width * 0.3 + "px";
});

const setSeletonAfterRight = computed(() => {
    let width = Number(props.width) || Number(props.size) || 100;
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
