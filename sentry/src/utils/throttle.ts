export function throttle<This, Args extends unknown[], Return>(
  fn: (this: This, ...args: Args) => Return,
  delay = 300,
): (this: This, ...args: Args) => void {
  let latestTimestamp = 0;

  return function (this: This, ...args: Args) {
    const now = Date.now();
    if (now - latestTimestamp > delay) {
      latestTimestamp = Date.now();
      fn.apply(this, args);
      return;
    }
  };
}

export function throttleV2<This, Args extends unknown[], Return>(
  fn: (this: This, ...args: Args) => Return,
  delay = 300,
): (this: This, ...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: This, ...args: Args) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}
