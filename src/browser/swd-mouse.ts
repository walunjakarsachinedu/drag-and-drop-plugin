import { MouseData, SwdEvent, SwdZoneElmentData } from "../types/types";

class SwdMouse {

  static addEventListener(type: 'mousedown'|'mousemove'|'mouseup', listener: (ev: SwdEvent) => any) {
    const normalizedListener = this._convertToNormalListener(listener);
    switch(type) {
      case 'mousedown': 
        document.addEventListener('mousedown', normalizedListener);
        document.addEventListener('touchstart', normalizedListener);
        break;
      case 'mousemove': 
        document.addEventListener('mousemove', normalizedListener);
        document.addEventListener('touchmove', normalizedListener);
      case 'mouseup': 
        document.addEventListener('mouseup', normalizedListener);
        document.addEventListener('touchend', normalizedListener);
        document.addEventListener('touchcancel', normalizedListener); // Fallback for touch cancel
    }
  }

  static extractSwdTargets(event: SwdEvent): string|undefined {
    return event.target.dataset.swdTargets;
  }
  static extractSwdZones(event: SwdEvent): string|undefined {
    return event.target.dataset.swdZones;
  }

  private static _convertToNormalListener(listener: (ev: SwdEvent) => any) : (ev: TouchEvent|MouseEvent) => any {
    return (ev: TouchEvent|MouseEvent) => {
      const data = this._preparekSwdEventData(ev);
      listener(data);
    };
  }

  private static _preparekSwdEventData(event: MouseEvent|TouchEvent) : SwdEvent {
    const target = this._getTarget(event);
    const height = target.offsetHeight, width = target.offsetHeight;
    const x = target.offsetLeft, y = target.offsetTop;
    const mouseX = event instanceof MouseEvent ? event.pageX : (event as TouchEvent).changedTouches[0].pageX;
    const mouseY = event instanceof MouseEvent ? event.pageY : (event as TouchEvent).changedTouches[0].pageY;
    const dx = mouseX-x, dy = mouseY-y;

    const swdZoneElement: SwdZoneElmentData = { 
      x, y, 
      width, height, 
      dataset: target.dataset, 
      elementRef: target
    };
    const mouseData: MouseData = { x: mouseX, y: mouseY, dx, dy};

    return {target: swdZoneElement, mouseData: mouseData};
  }

  private static _getTarget(event: MouseEvent | TouchEvent): HTMLElement {
    let target: HTMLElement;

    if (event instanceof MouseEvent) {
        target = event.target as HTMLElement;
    } else if (event instanceof TouchEvent) {
        const touch = event.changedTouches[0];
        if (touch) {
          target = document.elementFromPoint(touch.pageX, touch.pageY) as HTMLElement;
        }
    }

    return target!;
  }

}

export {SwdMouse};
