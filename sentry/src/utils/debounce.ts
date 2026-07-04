export default function debounce<This, Args extends unknown[], Return>(
  fn: (this: This, ...args: Args) => Return,
  delay = 300,
): (this: This, ...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: This, ...args: Args) {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}
