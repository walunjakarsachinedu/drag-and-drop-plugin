import { DragElementGetter, SwdEvent } from "../../types/types";
import { clearTextSelection } from "../../util/utils";

class DraggableCopy implements DragElementGetter {
  private draggableCopy: HTMLElement|null = null;
  private draggable: HTMLElement|null = null;

  /**
   * Creates a copy of the target element and adds it to the DOM.
   * @param event - The mouse event.
   */
  addElemCopyToDom(element: HTMLElement) {
    this.draggable = element;
    this.draggableCopy = element.cloneNode(true) as HTMLElement;
    delete this.draggableCopy.dataset.swdZones;
    this.draggableCopy.classList.add("draggable-element");
    this.draggableCopy.style.display = 'none';
    document.body.appendChild(this.draggableCopy);
  }


  /**
   * Updates the position of the draggable copy to follow the mouse cursor.
   * @param event - The mouse event.
   */
  makeElmFollowMouse(event: SwdEvent) {
    if(!this.draggableCopy) return;

    this.draggableCopy.style.display = "";
    clearTextSelection();
    const width = this.draggableCopy.offsetWidth;
    this.draggableCopy.style.position = "fixed";
    this.draggableCopy.style.left = `${event.mouseData.x-width/2}px`;
    this.draggableCopy.style.top = `${event.mouseData.y}px`;
    this.draggableCopy.style.pointerEvents = 'none';
  }

  getDraggedElement(): HTMLElement|null {
    return this.draggable;
  }

  /**
   * Removes the draggable copy from the DOM.
   */
  removeCopyFromDom() {
    if (!this.draggableCopy) return;

    document.body.removeChild(this.draggableCopy);
    this.draggableCopy = null;
    this.draggable = null;
  }
}

// represent singleton instance
const draggableCopy = new DraggableCopy();

export { draggableCopy };
