import { EventEmitter, EventHandler } from "./util/event-emitter";
import { clearTextSelection } from "./util/utils";

var isDragging = false;

/**  
 * Emit event for element with `data-drop-target` attribute.
*/
class Draggable {
  private e_dragStart: EventEmitter<void> = new EventEmitter<void>();
  private e_dragMove: EventEmitter<void> = new EventEmitter<void>();
  private e_dragEnd: EventEmitter<void> = new EventEmitter<void>();
  constructor() {
    document.addEventListener('mousedown', (event: MouseEvent) => {
      const target = event.target as HTMLElement|null|undefined;
      if (!target?.hasAttribute('data-drop-target')) return;

      this.e_dragStart.emit();
      isDragging = true;
    });

    document.addEventListener('mousemove', (event: MouseEvent) => {
      if(!isDragging) return;

      this.e_dragMove.emit();
    });

    document.addEventListener('mouseup', () => {
      if(!isDragging) return;

      this.e_dragEnd.emit();
      isDragging = false;
    });
  }

  onDragStart(handler: EventHandler<void>) {
    this.e_dragStart.addListener(handler);
  }

  onDragMove(handler: EventHandler<void>) {
    this.e_dragMove.addListener(handler);
  }

  onDragEnd(handler: EventHandler<void>) {
    this.e_dragEnd.addListener(handler);
  }
}

export default Draggable;