import { LitElement, customElement } from "@swifty.js/lit-jsx";
import { scroll } from "motion";

declare global {
  interface HTMLElementTagNameMap {
    "scroll-progress": ScrollProgressElement;
  }
}

/**
 * Reading-progress bar driven by motion's vanilla scroll tracker;
 * scaleX follows the document scroll progress each frame.
 */
@customElement("scroll-progress")
export class ScrollProgressElement extends LitElement {
  private stopScroll?: () => void;

  protected override createRenderRoot(): HTMLElement {
    return this;
  }

  protected override firstUpdated(): void {
    this.style.transform = "scaleX(0)";
    this.stopScroll = scroll((progress: number) => {
      this.style.transform = `scaleX(${progress})`;
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopScroll?.();
  }
}
