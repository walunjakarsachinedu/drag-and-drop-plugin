import { SwdEvent } from "../../types/types";
import { EventEmitter, EventHandler } from "../../util/event-emitter";
import { SwdMouse } from "../utility/swd-mouse";

var isDragging = false;

/**  
 * Emit event for element with `data-swd-targets` attribute.
*/
class DraggableZone {
  private e_dragStart: EventEmitter<SwdEvent> = new EventEmitter<SwdEvent>();
  private e_dragMove: EventEmitter<SwdEvent> = new EventEmitter<SwdEvent>();
  private e_dragEnd: EventEmitter<SwdEvent|undefined> = new EventEmitter<SwdEvent|undefined>();
  constructor() {
    SwdMouse.addEventListener('mousedown', (event?: SwdEvent) => {
      if(!event) return;

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

      if (!SwdMouse.extractSwdTargets(event)) return;

      this.e_dragStart.emit(event);
      isDragging = true;
    });

    SwdMouse.addEventListener('mousemove', (event?: SwdEvent) => {
      if(!event) return;
      if(!isDragging) return;

      this.e_dragMove.emit(event);
    });

    SwdMouse.addEventListener('mouseup', (event?: SwdEvent) => {
      if(!isDragging) return;

      this.e_dragEnd.emit(event);
      isDragging = false;
    });
  }

  onDragStart(handler: EventHandler<SwdEvent>) {
    this.e_dragStart.addListener(handler);
  }

  onDragMove(handler: EventHandler<SwdEvent>) {
    this.e_dragMove.addListener(handler);
  }

  onDragEnd(handler: EventHandler<SwdEvent|undefined>) {
    this.e_dragEnd.addListener(handler);
  }

  private _isDragPoint(event: SwdEvent) : boolean {
    const dragPoint = event.target.elementRef.closest('[data-swd-drag-point]') as HTMLElement|null; 
    return !!dragPoint;
  }

  private _findDraggableAncestor(event: SwdEvent) : HTMLElement|null {
    const dragPoint = event.target.elementRef.closest('[data-swd-drag-point]') as HTMLElement|null; 
    if(!dragPoint) return null;
    const dragPointValue = dragPoint.dataset.swdDragPoint;
    const draggable = dragPoint?.closest(`[data-swd-target-drag-point=${dragPointValue}][data-swd-targets]`) as HTMLElement|null;
    return draggable;
  }
}

export { DraggableZone };
