<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navigation from './components/layout/Navigation.vue';
</script>

<template>
  <div>
    <Navigation></Navigation>
    <Transition name="z-axis">
      <RouterView></RouterView>
    </Transition>
  </div>
</template>

<style scoped>
/* 进入时的动画 */
.z-axis-enter-active {
  transition: all 0.5s ease;
}

/* 进入开始状态 */
.z-axis-enter-from {
  transform: translateZ(-100px) scale(1.5);
  opacity: 0;
}

/* 进入结束状态 */
.z-axis-enter-to {
  transform: translateZ(0) scale(1);
  opacity: 1;
}

/* 移出时的动画 */
.z-axis-leave-active {
  transition: all 0.5s ease;
}

/* 移出开始状态 */
.z-axis-leave-from {
  transform: translateZ(0) scale(1);
  opacity: 1;
}

/* 移出结束状态 */
.z-axis-leave-to {
  transform: translateZ(-100px) scale(0.8);
  opacity: 0;
}
</style>
