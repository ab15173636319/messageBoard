import localtion from "@/utils/localtion";
import type { DirectiveBinding } from "vue";

/**
 * 是否聚焦回复输入框，子元素必须含有textarea元素
 * @param el 元素
 * @param binding 指令绑定
 * @returns void
 * @example
 * <template>
 *   <div v-replay="true">
 *     <textarea></textarea>
 *   </div>
 * </template>
 */

export const vReplay = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const textarea = el.children[1] as HTMLTextAreaElement;
    if (
      binding.value ||
      binding.value === undefined ||
      binding.value === null
    ) {
      localtion(0, textarea.getBoundingClientRect().bottom + 10);
      textarea.focus();
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const textarea = el.children[1] as HTMLTextAreaElement;
    if (
      binding.value ||
      binding.value === undefined ||
      binding.value === null
    ) {
      localtion(0, textarea.getBoundingClientRect().bottom + 10);
      textarea.focus();
    }
  },
};
