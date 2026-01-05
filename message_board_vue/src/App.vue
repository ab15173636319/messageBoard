<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navigation from './components/layout/Navigation.vue';
import { onMounted, onBeforeMount } from "vue"

function loadImage(entries: IntersectionObserverEntry[]) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const src = entry.target.getAttribute("src")
      if (!src) return
      entry.target.setAttribute("src", "")
      const image = new Image()
      image.src = src
      lazyLoadImage(image, 'loading')
      image.onload = () => {
        entry.target.setAttribute("src", src)
        lazyLoadImage(image, 'loaded')
      }
    }
  })
}

function lazyLoadImage(image: HTMLImageElement, mode: 'loading' | 'loaded') {
  if (mode === 'loading') {
    // 隐藏图片
    image.style.display = 'none';

    // 创建骨架容器
    const skeleton = document.createElement('div');
    skeleton.className = 'image-skeleton';
    skeleton.style.width = image.width + 'px';
    skeleton.style.height = image.height + 'px';

    // 保存原始父元素和位置，以便后续恢复
    (image as any)._skeleton = skeleton;
    (image as any)._parent = image.parentNode;

    // 将骨架插入到图片之前
    image.parentNode?.insertBefore(skeleton, image);
  } else if (mode === 'loaded') {
    // 显示图片
    image.style.display = '';

    // 移除骨架
    const skeleton = (image as any)._skeleton;
    if (skeleton && skeleton.parentNode) {
      skeleton.parentNode.removeChild(skeleton);
    }

    // 清除保存的引用
    delete (image as any)._skeleton;
    delete (image as any)._parent;
  }
}

onMounted(() => {
  const images = document.querySelectorAll("img")
  const observer = new IntersectionObserver((entries) => {
    loadImage(entries)
  })
  images.forEach(image => {
    observer.observe(image)
  })
})


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
/* 骨架容器样式 */
.image-skeleton {
  position: relative;
  display: inline-block;
  /* 或 block，根据图片布局决定 */
  overflow: hidden;
  background-color: #f0f0f0;
  /* 骨架底色 */
}

/* 闪光动画 */
.image-skeleton::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 100%);
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    left: -150%;
  }

  100% {
    left: 150%;
  }
}

/* 图片加载完成后隐藏骨架 */
.image-skeleton.loaded::after {
  display: none;
}

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
