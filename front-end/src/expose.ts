const OBSERVER_QUERY = ['[data-expose]'];

const THRESHOLD = 0.5;
export default class Expose {
  private intersectionObserver: IntersectionObserver;
  private observerList: Element[] = [];

  constructor() {
    if (!IntersectionObserver) return;
    this.intersectionObserver = new IntersectionObserver(this.ioHandler.bind(this), {
      threshold: THRESHOLD
    });
  }

  private ioHandler(entries: IntersectionObserverEntry[]): void {
    entries.forEach((io) => {
      const rootHeight = io.rootBounds
        ? io.rootBounds.height
        : document.documentElement.offsetHeight;
      const visibleHeight = io.intersectionRect.height;

      // 元素的一半以上在视口内；或者元素的可视高度超过视口的一半以上
      if (io.isIntersecting || visibleHeight / rootHeight >= THRESHOLD) {
        this.dispatchExpose(io.target);
      }
    });
  }

  private dispatchExpose(target: Element): void {
    const evt = new Event('dataExpose', {
      bubbles: true
    });

    target.dispatchEvent(evt);
  }

  private addObserver(query: string[]): void {
    query.forEach((attr) => {
      document.querySelectorAll(attr).forEach((el) => {
        if (!this.observerList.includes(el)) {
          this.observerList.push(el);
          this.intersectionObserver.observe(el);
        }
      });
    });
  }

  public publish(): void {
    this.addObserver(OBSERVER_QUERY);
  }
}
