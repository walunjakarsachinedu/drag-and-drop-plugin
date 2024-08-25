import { EventEmitter, EventHandler } from "../util/event-emitter";

var isDragging = false;

/**  
 * Emit event for element with `data-drop-target` attribute.
*/
class DraggableZone {
  private e_dragStart: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  private e_dragMove: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  private e_dragEnd: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  constructor() {
    document.addEventListener('mousedown', (event: MouseEvent) => {
      const target = event.target as HTMLElement|null|undefined;
      if (!target?.hasAttribute('data-drop-target')) return;

      this.e_dragStart.emit(event);
      isDragging = true;
    });

    document.addEventListener('mousemove', (event: MouseEvent) => {
      if(!isDragging) return;

      this.e_dragMove.emit(event);
    });

    document.addEventListener('mouseup', (event: MouseEvent) => {
      if(!isDragging) return;

      this.e_dragEnd.emit(event);
      isDragging = false;
    });
  }

  onDragStart(handler: EventHandler<MouseEvent>) {
    this.e_dragStart.addListener(handler);
  }

  onDragMove(handler: EventHandler<MouseEvent>) {
    this.e_dragMove.addListener(handler);
  }

  onDragEnd(handler: EventHandler<MouseEvent>) {
    this.e_dragEnd.addListener(handler);
  }
}

export default DraggableZone;