import { SwdEventWithTarget } from "../../types/types";
import { SwdMouse, SwdSubscription } from "./swd-mouse";

type ScrollDirection = 'top' | 'bottom' | 'left' | 'right';

const direction: ScrollDirection[] = ['top', 'bottom', 'left', 'right'];

interface ScrollData {
  direction: ScrollDirection; // at concrete level represent edge 
  distanceFromEdge: number;
}

class Scrollable {
  private scrollFrameIds: Partial<Record<ScrollDirection, number>> = {};
  private scrollDistances: Partial<Record<ScrollDirection, number>> = {};
  private swdMouseSubscription: SwdSubscription|null = null;
  private previousTarget: HTMLElement|null = null;

  constructor(
    /** Distance (in pixels) from the edge of the container at which auto-scrolling starts. */
    private readonly autoScrollActivationDistance: number = 30, 
    /** Determines how quickly the scroll speed increases as the pointer gets closer to the edge. */ 
    private readonly scrollAccelerationRate: number = 5,
  ) { }


  enableAutoScroll() {
    this.swdMouseSubscription = SwdMouse.addEventListenerWithTarget("mousemove", (ev: SwdEventWithTarget) => {
      if(this.previousTarget) {
        const scrollData = this._getScrollData(SwdMouse.updateTargetOfSwdEvent(ev, this.previousTarget));
        if(scrollData.length > 0) {
          scrollData.forEach(data => {
            this.scrollDistances[data.direction] = data.distanceFromEdge;
          });
          // stop un-necessary scrolling
          direction
            .filter((dir) => !scrollData.some(data => data.direction == dir) && this.scrollFrameIds[dir])
            .forEach((dir) => {
                cancelAnimationFrame(this.scrollFrameIds[dir]!);
                delete this.scrollFrameIds[dir];
            });
          scrollData.forEach(data => this._scrollContinously(data.direction));
        }
        else {
          this._searchScrollableAndScroll(ev); 
        }
      }
      else {
        this._searchScrollableAndScroll(ev); 
      }
    });
  }

  disableAutoScroll() {
    if(this.swdMouseSubscription) {
      SwdMouse.clearEventListener("mousemove", this.swdMouseSubscription);
      this.swdMouseSubscription = null;
    }
    this._stopScrollInAllDirection();
  }

  isScrolling() : boolean {
    return !!(this.scrollFrameIds.left || this.scrollFrameIds.right || this.scrollFrameIds.top || this.scrollFrameIds.bottom);
  }


  private _searchScrollableAndScroll(event: SwdEventWithTarget) {
    const target = event.target.elementRef;
    const scrollData = this._getScrollData(event);
    if(scrollData.length > 0) {
      // cleanup for previous scroll
      this._stopScrollInAllDirection();
      scrollData.forEach(data => {
        this.scrollDistances[data.direction] = data.distanceFromEdge;
      })
      // setup for new scroll
      this.previousTarget = target;
      scrollData.forEach((data) => this._scrollContinously(data.direction));
    }
    else {
      if(target.parentElement) {
        this._searchScrollableAndScroll(SwdMouse.updateTargetOfSwdEvent(event, target.parentElement));
      }
      else {
        this._stopScrollInAllDirection();
      }
    }
  }

  private _stopScrollInAllDirection() {
    Object.values(this.scrollFrameIds).forEach((frameId) => {
      cancelAnimationFrame(frameId);
    })
    this.scrollFrameIds = {};
    this.scrollDistances = {};
    this.previousTarget = null;
  }

  private _stopScrollInDirection(direction: ScrollDirection) {
    if(this.scrollFrameIds[direction]) {
      cancelAnimationFrame(this.scrollFrameIds[direction]);
      delete this.scrollFrameIds[direction];
      delete this.scrollDistances[direction];
    }
  }

  private _getScrollData(event: SwdEventWithTarget): ScrollData[] {
    const { x, y, width, height, elementRef } = event.target;
    const { x: mouseX, y: mouseY } = event.mouseData;
    const distance = this.autoScrollActivationDistance;
    const scrollData: ScrollData[] = [];

    let leftEdge = x;
    let rightEdge = x + width;
    let topEdge = y;
    let bottomEdge = y + height;

    // Handling special case of HTML tag: HTML's getBoundingClientRect includes scroll offset, 
    // so we use viewport coordinates to detect edges correctly for full-page scrolling
    if(elementRef.tagName == "HTML") {
      leftEdge = 0;
      topEdge = 0;
      rightEdge = window.innerWidth;
      bottomEdge = window.innerHeight;
    }

    if(elementRef.scrollWidth > elementRef.clientWidth) {
      const dl = mouseX - leftEdge;
      const dr = rightEdge - mouseX;
      const canScrollLeft = elementRef.scrollLeft > 0;
      const canScrollRight = elementRef.scrollLeft < elementRef.scrollWidth - elementRef.clientWidth;
      if (dl < distance && dl > 0 && canScrollLeft) {
        scrollData.push({
          direction: "left",
          distanceFromEdge: dl,
        });
      } else if (dr < distance && dr > 0 && canScrollRight) {
        scrollData.push({
          direction: "right",
          distanceFromEdge: dr,
        });
      }
    }

    if(elementRef.scrollHeight > elementRef.clientHeight) {
      const dt = mouseY - topEdge;
      const db = bottomEdge - mouseY;
      const canScrollTop = elementRef.scrollTop > 0;
      const canScrollBottom = elementRef.scrollTop < elementRef.scrollHeight - elementRef.clientHeight;
      if (dt  < distance && dt > 0 && canScrollTop) {
        scrollData.push({
          direction: "top",
          distanceFromEdge: dt,
        });
      } else if (db < distance && db > 0 && canScrollBottom) {
        scrollData.push({
          direction: "bottom",
          distanceFromEdge: db,
        });
      }
    }


    return scrollData;
  }

  /** give consistent speed for all refresh rate. */
  private _scrollContinously(direction: ScrollDirection): void {
    if(this.scrollFrameIds[direction]) return;

    let lastTimestamp: number|null = null;
    const scrollFn = (timestamp: number) => {
      const dist = this.scrollDistances[direction];
      if (!dist) {
        this._stopScrollInDirection(direction);
        return;
      }

      // Initialize lastTimestamp
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      // Time elapsed since last frame (ms)
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Base speed at 60fps
      const baseSpeed = this._getScrollSpeed(dist);

      // Scale to actual frame time
      const pixels = baseSpeed * (deltaTime / 16.7);

      this._scrollByDirection(direction, pixels);
      this.scrollFrameIds[direction] = requestAnimationFrame(scrollFn);
    };

    this.scrollFrameIds[direction] = requestAnimationFrame(scrollFn);
  }

  /** Give absolute speed based on how close that dragged element from edge. */
  private _getScrollSpeed(distanceFromEdge: number): number {
    const activation = this.autoScrollActivationDistance;

    if (distanceFromEdge >= activation) return 0;

    const ratio = (activation - distanceFromEdge) / activation + 1;
    return Math.ceil(this.scrollAccelerationRate * ratio * ratio); // quadratic acceleration
  }

  private _scrollByDirection(direction: ScrollDirection, steps: number): void {
    if(!this.previousTarget) return;

    const container = this.previousTarget;

    switch (direction) {
      case 'top':
        container.scrollBy(0, -steps);
        break;
      case 'bottom':
        container.scrollBy(0, steps);
        break;
      case 'left':
        container.scrollBy(-steps, 0);
        break;
      case 'right':
        container.scrollBy(steps, 0);
        break;
    }
  }
}

// represent singleton instance
const scrollable = new Scrollable();

export { scrollable };
