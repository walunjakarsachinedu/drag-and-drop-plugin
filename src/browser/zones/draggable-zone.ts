import { SwdEvent, SwdEventWithTarget } from "../../types/types";
import { EventEmitter, EventHandler } from "../../util/event-emitter";
import { SwdMouse, SwdSubscription } from "../utility/swd-mouse";

let isDragging = false;
let preventScrolling = false;

// Prevent scrolling on touch based device
// Fix: Chrome allowed scroll when swiping from HTML to search bar
window.addEventListener(
  'touchmove',
  (event) => {
    if (preventScrolling) {
      event.preventDefault();
    }
  },
  {passive: false},
);


/**  
 * Emit event for element with `data-swd-targets` attribute.
*/
class DraggableZone {
  private e_dragStart: EventEmitter<SwdEventWithTarget> = new EventEmitter<SwdEventWithTarget>();
  private e_dragMove: EventEmitter<SwdEvent> = new EventEmitter<SwdEvent>();
  private e_dragEnd: EventEmitter<SwdEvent> = new EventEmitter<SwdEvent>();

  private delayTimeout: NodeJS.Timeout|null = null;

  private mouseDownSubs: SwdSubscription|null = null;
  private mouseMoveSubs: SwdSubscription|null = null;
  private mouseUpSubs: SwdSubscription|null = null;

  constructor(
    /** set delay for touch based device. */
    private readonly dragDelayInMillis: number = 200
  ) { }

  listenToDragZones() {
    // cleaning previous listener
    this.cleanListener();

    this.mouseDownSubs = SwdMouse.addEventListenerWithTarget('mousedown', (event: SwdEventWithTarget) => {
      if(this._isDragPoint(event)) {
        const draggable = this._findDraggableAncestor(event);
        if(!draggable) return;
        event = SwdMouse.updateTargetOfSwdEvent(event, draggable);
      }
      else {
        const target = event.target.elementRef.closest('[data-swd-targets]:not([data-swd-target-drag-point])') as HTMLElement|null;
        if(!target) return;
        event = SwdMouse.updateTargetOfSwdEvent(event, target);
      }

      /// for touch based device, start drag after small delay.
      if(event.mouseType == "touch") {
        this.delayTimeout = setTimeout(() => {
          this._startDrag(event);
        }, this.dragDelayInMillis);
      }
      else {
        this._startDrag(event);
      }
    });

    this.mouseMoveSubs = SwdMouse.addEventListener('mousemove', (event: SwdEvent) => {
      this._cancelDrag();
      if(!isDragging) return;
      preventScrolling = true;

      this.e_dragMove.emit(event);
    });

    this.mouseUpSubs = SwdMouse.addEventListener('mouseup', (event: SwdEvent) => {
      this._cancelDrag();
      if(!isDragging) return;

      this.e_dragEnd.emit(event);
      isDragging = false;
      preventScrolling = false;
    });
  }

  /** Just remove mouse listeners. */
  cleanListener() {
    if(this.mouseDownSubs) {
      SwdMouse.clearEventListener("mousedown", this.mouseDownSubs);
      this.mouseDownSubs = null;
    }
    if(this.mouseMoveSubs) {
      SwdMouse.clearEventListener("mousemove", this.mouseMoveSubs);
      this.mouseMoveSubs = null;
    }
    if(this.mouseUpSubs) {
      SwdMouse.clearEventListener("mouseup", this.mouseUpSubs);
      this.mouseUpSubs = null;
    }
  }

  /** Clean everything, including mouse listener + custom event listeners */
  clean() {
    this.cleanListener();
    this.e_dragStart.clear();
    this.e_dragMove.clear();
    this.e_dragEnd.clear();
  }

  onDragStart(handler: EventHandler<SwdEventWithTarget>) {
    this.e_dragStart.addListener(handler);
  }

  onDragMove(handler: EventHandler<SwdEvent>) {
    this.e_dragMove.addListener(handler);
  }

  onDragEnd(handler: EventHandler<SwdEvent|undefined>) {
    this.e_dragEnd.addListener(handler);
  }

  private _isDragPoint(event: SwdEventWithTarget) : boolean {
    const dragPoint = event.target.elementRef.closest('[data-swd-drag-point]') as HTMLElement|null; 
    return !!dragPoint;
  }

  private _findDraggableAncestor(event: SwdEventWithTarget) : HTMLElement|null {
    const dragPoint = event.target.elementRef.closest('[data-swd-drag-point]') as HTMLElement|null; 
    if(!dragPoint) return null;
    const dragPointValue = dragPoint.dataset.swdDragPoint;
    const draggable = dragPoint?.closest(`[data-swd-target-drag-point=${dragPointValue}][data-swd-targets]`) as HTMLElement|null;
    return draggable;
  }


  private _startDrag(event: SwdEventWithTarget) {
    this.e_dragStart.emit(event);
    isDragging = true;
  }

  private _cancelDrag() { 
    if(!this.delayTimeout) return;
    clearTimeout(this.delayTimeout);
    this.delayTimeout = null;
  }
}

// represent singleton instance
const draggableZone = new DraggableZone();

export { draggableZone };
