import { clearTextSelection } from "../util/utils";

class MakeCopyFollowMouse {
  draggableCopy: HTMLElement|null|undefined;

  /**
   * Creates a copy of the target element and adds it to the DOM.
   * @param event - The mouse event.
   */
  addElemCopyToDom(event: MouseEvent) {
    (event.target as HTMLElement|null|undefined)?.cloneNode(true);
    this.draggableCopy = (event.target as HTMLElement|null|undefined)?.cloneNode(true) as HTMLElement|null|undefined;
    if(!this.draggableCopy) return;
    this.draggableCopy.classList.add("draggable-element");
    document.body.appendChild(this.draggableCopy);
  }


  /**
   * Updates the position of the draggable copy to follow the mouse cursor.
   * @param event - The mouse event.
   */
  makeElmFollowMouse(event: MouseEvent) {
    if(!this.draggableCopy) return;

    clearTextSelection();
    const width = this.draggableCopy.offsetWidth;
    this.draggableCopy.style.left = `${event.pageX-width/2}px`;
    this.draggableCopy.style.top = `${event.pageY}px`;
  }


  /**
   * Removes the draggable copy from the DOM.
   */
  removeCopyFromDom() {
    if (!this.draggableCopy) return;

    document.body.removeChild(this.draggableCopy);
    this.draggableCopy = null;
  }
}

export default MakeCopyFollowMouse;