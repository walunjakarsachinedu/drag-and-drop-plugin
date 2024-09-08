import { MouseData, SwdEvent, SwdZoneElmentData } from "../../types/types";

type SwdTouch = {target: HTMLElement, identifier: number|null, pageX: number, pageY: number};

class SwdMouse {
  static touchData?: SwdTouch; 

  /** Emits a null SwdEvent if the target is null.  */ 
  static addEventListener(type: 'mousedown'|'mousemove'|'mouseup', listener: (ev?: SwdEvent) => any) {
    const normalizedListener = SwdMouse._convertToNormalListener(listener);
    switch(type) {
      case 'mousedown': 
        document.addEventListener('mousedown', normalizedListener);
        document.addEventListener('touchstart', SwdMouse._onTouchStart(listener));
        break;
      case 'mousemove': 
        document.addEventListener('mousemove', normalizedListener);
        document.addEventListener('touchmove', SwdMouse._onTouchMove(listener));
        break;
      case 'mouseup': 
        document.addEventListener('mouseup', normalizedListener);
        document.addEventListener('touchend', SwdMouse._onTouchEnd(listener));
        document.addEventListener('touchcancel', SwdMouse._onTouchEnd(listener)); // Fallback for touch cancel
        break;
    }
  }

  static extractSwdTargets(event: SwdEvent): string|undefined {
    return event.target.dataset.swdTargets;
  }
  static extractSwdZones(event: SwdEvent): string|undefined {
    return event.target.dataset.swdZones;
  }

  private static _convertToNormalListener(listener: (ev?: SwdEvent) => any) : (ev: TouchEvent|MouseEvent) => any {
    return (event: TouchEvent|MouseEvent) => {
      if(!SwdMouse._getTarget(event)) return listener(undefined);
      const data = SwdMouse._preparekSwdEventData(event);
      return listener(data);
    };
  }

  private static _preparekSwdEventData(event: MouseEvent|TouchEvent) : SwdEvent {
    const target = SwdMouse._getTarget(event);

    const swdZoneElement: SwdZoneElmentData = this.getElementData(target);
    const mouseData: MouseData = this.getMouseData(event);

    return {target: swdZoneElement, mouseData: mouseData};
  }

  public static getElementData(element: HTMLElement) : SwdZoneElmentData {
    const height = element.offsetHeight, width = element.offsetWidth;
    const x = element.offsetLeft, y = element.offsetTop;
    const swdZoneElement: SwdZoneElmentData = { 
      x, y, 
      width, height, 
      dataset: element.dataset, 
      elementRef: element
    };
    return swdZoneElement;
  }

  public static getMouseData(event: MouseEvent|TouchEvent) : MouseData {
    const target = SwdMouse._getTarget(event);
    const x = target.offsetLeft, y = target.offsetTop;
    const mouseX = event instanceof MouseEvent ? event.pageX : SwdMouse.touchData?.pageX!;
    const mouseY = event instanceof MouseEvent ? event.pageY : SwdMouse.touchData?.pageY!;
    const dx = mouseX-x, dy = mouseY-y;
    const mouseData: MouseData = { x: mouseX, y: mouseY, dx, dy};
    return mouseData;
  }

  private static _getTarget(event: MouseEvent | TouchEvent): HTMLElement {
    let target: HTMLElement;

    if (event instanceof MouseEvent) {
        target = event.target as HTMLElement;
    } else if (event instanceof TouchEvent) {
        target = SwdMouse.touchData!.target as HTMLElement;
    }
    return target!;
  }


  /* ✋ start logic: to restrict single finger touch */

  /** Wrap listener in listener which is accepted touch event listener. */
  private static _onTouchStart(listener: (ev?: SwdEvent) => any) : (ev: TouchEvent) => any {
    const normalizedListener = SwdMouse._convertToNormalListener(listener);
    return (touchEvent: TouchEvent) => {
      const touch = SwdMouse._getTouchEvent(touchEvent.touches);
      if(!touch) {
        SwdMouse.touchData = {
          target: touchEvent.changedTouches[0].target as HTMLElement, 
          identifier: touchEvent.changedTouches[0].identifier,
          pageX: touchEvent.changedTouches[0].pageX,
          pageY: touchEvent.changedTouches[0].pageY,
        };
        normalizedListener(touchEvent);
      }
    }
  }


  /** Wrap listener in listener which is accepted touch event listener. */
  private static _onTouchMove(listener: (ev?: SwdEvent) => any) : (ev: TouchEvent) => any {
    const normalizedListener = SwdMouse._convertToNormalListener(listener);
    return (touchEvent: TouchEvent) => {
      const touch = this._getTouchEvent(touchEvent.changedTouches);
      if(touch) {
        SwdMouse.touchData!.target = document.elementFromPoint(touch.pageX, touch.pageY) as HTMLElement;
        SwdMouse.touchData!.pageX = touch.pageX;
        SwdMouse.touchData!.pageY = touch.pageY;
        // async with original object
        normalizedListener(touchEvent);
      }
    }
  }


  /** Wrap listener in listener which is accepted touch event listener. */
  private static _onTouchEnd(listener: (ev?: SwdEvent) => any) : (ev: TouchEvent) => any {
    const normalizedListener = SwdMouse._convertToNormalListener(listener);
    return (touchEvent: TouchEvent) => {
      const touch = this._getTouchEvent(touchEvent.changedTouches);
      if(touch) {
        SwdMouse.touchData!.identifier = null;
        normalizedListener(touchEvent);
      }
    }
  }

  private static _getTouchEvent(touchList: TouchList) : Touch|undefined {
    const touch = [...touchList].find(touch => touch.identifier == SwdMouse.touchData?.identifier);
    if(touch) return touch;
    return undefined;
  }


  /* 🛑 end logic: to restrict single finger touch */

}

export {SwdMouse};
