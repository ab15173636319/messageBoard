export default function localtion(
  x: number = 0,
  y: number = 0,
  delay: number = 100
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  timer = setTimeout(() => {
    window.scrollTo(x, y);
  }, delay);
  timer && clearTimeout(timer);
  timer = null;
}
