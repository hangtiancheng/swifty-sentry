function dom2str(target: HTMLElement): string {
  let current: HTMLElement | null = target;
  const path: string[] = [];

  while (
    current &&
    current.tagName &&
    current.tagName.toLowerCase() !== "html" &&
    path.length < 5
  ) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += `#${current.id}`;
    } else if (current.className && typeof current.className === "string") {
      selector += `.${current.className.split(/\s+/).join(".")}`;
    }
    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(" > ");
}

export default dom2str;
