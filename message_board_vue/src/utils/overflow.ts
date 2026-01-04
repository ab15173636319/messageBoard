export const hideOverflow = (delay: number = 500) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  document.body.style.overflow = "hidden";

  timer = setTimeout(() => {
    document.body.style.overflow = "";
  }, delay);

  return () => {
    timer && clearTimeout(timer);
    timer = null;
    document.body.style.overflow = "";
  };
};
