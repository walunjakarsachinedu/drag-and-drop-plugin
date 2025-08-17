import { DragElementGetter, DropEvent, DropEventDetail, DropTarget } from "../../types/types";
import { dropUtility } from "../utility/drop-indicator-utility";
import { draggableCopy } from "./draggable-copy";

class DropIndicator {
  private _dropIndicator: HTMLElement = document.createElement("div");
  private _dragTarget: DropTarget|null = null;

  constructor(private dragUtils: DragElementGetter) {
    this.hideDropIndicator();
    this._dropIndicator.style.pointerEvents = 'none';
    this._dropIndicator.classList.add('drop-indicator');
    document.body.appendChild(this._dropIndicator);
  }
  
  showDropIndicator(event: DropEvent) {
    if(!event.target || !event.placement) {
      this.hideDropIndicator();
      return;
    }
    this._dragTarget = {target: event.target, area: event.placement};
    this._showElementAndEnableAnimation();
    dropUtility.placeIndicatorAtArea(event.target, event.placement, this._dropIndicator);
  }

  private _showElementAndEnableAnimation() {
    const styles = window.getComputedStyle(this._dropIndicator);
    if(styles.display != 'none') return;

    // show element
    this._dropIndicator.style.display = "block";
    this._dropIndicator.style.pointerEvents = 'none';

    // enable animation
    const transition = styles.transition;
    this._dropIndicator.style.transition = 'none';
    setTimeout(() => {
      this._dropIndicator.style.transition = transition;
    });
  }

  emitDropEvent() {
    if(!this._dragTarget) return;
    const dropTarget = this._dragTarget.target.elementRef;
    const dropPos = this._dragTarget.area;
    const draggedElement = this.dragUtils.getDraggedElement();
    if(!draggedElement) return;
    const event = new CustomEvent<DropEventDetail>('swd-drop', {
      detail: { target: draggedElement, dropPos },
      bubbles: true,
      cancelable: true
    });
    dropTarget.dispatchEvent(event);
  }
  
  hideDropIndicator() {
    this._dragTarget = null;
    this._dropIndicator.style.display = "none";
  }
}

// represent singleton instance
const dropIndicator = new DropIndicator(draggableCopy);

export { dropIndicator };

