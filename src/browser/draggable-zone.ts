import { SwdEvent } from "../types/types";
import { EventEmitter, EventHandler } from "../util/event-emitter";
import { SwdMouse } from "./swd-mouse";

var isDragging = false;

/**  
 * Emit event for element with `data-swd-targets` attribute.
*/
class DraggableZone {
  private e_dragStart: EventEmitter<SwdEvent> = new EventEmitter<SwdEvent>();
  private e_dragMove: EventEmitter<SwdEvent> = new EventEmitter<SwdEvent>();
  private e_dragEnd: EventEmitter<SwdEvent> = new EventEmitter<SwdEvent>();
  constructor() {
    SwdMouse.addEventListener('mousedown', (event: SwdEvent) => {
      if (!event.target.dataset.swdTargets) return;

      this.e_dragStart.emit(event);
      isDragging = true;
    });

    SwdMouse.addEventListener('mousemove', (event: SwdEvent) => {
      if(!isDragging) return;

      this.e_dragMove.emit(event);
    });

    SwdMouse.addEventListener('mouseup', (event: SwdEvent) => {
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

  onDragEnd(handler: EventHandler<SwdEvent>) {
    this.e_dragEnd.addListener(handler);
  }
}

export { DraggableZone };