import { EventEmitter, EventHandler } from "../util/event-emitter";
import { extractTargetElement } from "../util/utils";

/**  
 * Emit event for element with `data-drop-target` attribute.
*/
class DroppableZone {
  private e_hovering: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  private droppableZone?: string;
  private previousHandler: any;
  
  /** 
   * extract drop-target from `event` & setup hovering listener based on value of drop-target.
  */
  listenToDroppableZone(dropZone: string|undefined) {
    if(!dropZone) return;

    this.droppableZone = dropZone;
    this.cleanListener();
    this.previousHandler = this._hoveringEventEmitter.bind(this);
    document.addEventListener('mousemove', this.previousHandler);
  }

  /**  
   * emits event when hovering droppable zone.
  */
  private _hoveringEventEmitter(event: MouseEvent) {
    const target = extractTargetElement(event);
    const isZoneDroppable = target && this.droppableZone && target.matches(this.droppableZone);
    if(!isZoneDroppable) return;

    this.e_hovering.emit(event);
  }

  cleanListener() {
    if(!this.previousHandler) return;
    document.removeEventListener('mousemove', this.previousHandler);
    this.previousHandler = null;
  }

  onHovering(handler: EventHandler<MouseEvent>) {
    this.e_hovering.addListener(handler);
  }
}

export default DroppableZone;