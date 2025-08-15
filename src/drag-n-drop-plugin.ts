import './index.css';
import { isDraggableWithGetter, isInDropZoneOrSpace, resetGlobalCursorStyle, setGlobalCursorStyleToMove } from './util/utils';
import { SwdMouse } from './browser/utility/swd-mouse';
import { DraggableZone } from './browser/zones/draggable-zone';
import { DroppableZone } from './browser/zones/droppable-zone';
import { DraggableCopy } from './browser/components/draggable-copy';
import { DropIndicator } from './browser/components/drop-indicator';
import { DroppableSpace } from './browser/zones/droppable-space';
import { Scrollable } from './browser/utility/scrollable';
import { DraggableWithGetter, DropEventDetail } from './types/types';


const draggableZone = new DraggableZone();
const droppableZone = new DroppableZone();
const droppableSpace = new DroppableSpace();

const draggableCopy = new DraggableCopy();
const dropIndicator = new DropIndicator(draggableCopy);

const scrollable = new Scrollable();

droppableSpace.onHovering((event) => {
  if(scrollable.isScrolling()) {
    dropIndicator.hideDropIndicator();
    return;
  }
  dropIndicator.showDropIndicator(event);
});

droppableZone.onHovering((event) => {
  if(scrollable.isScrolling()) {
    dropIndicator.hideDropIndicator();
    return;
  }
  dropIndicator.showDropIndicator(event);
});


draggableZone.onDragStart((event) => {
  setGlobalCursorStyleToMove();
  draggableCopy.addElemCopyToDom(event.target.elementRef);
  droppableZone.listenToDropZones(SwdMouse.extractSwdTargets(event));
  droppableSpace.listenToDropZones(SwdMouse.extractSwdTargets(event));
  scrollable.enableAutoScroll();
});

draggableZone.onDragMove((event) => {
  draggableCopy.makeElmFollowMouse(event);
  if(!isInDropZoneOrSpace(event)) {
    dropIndicator.hideDropIndicator();
  }
});

draggableZone.onDragEnd(() => {
  resetGlobalCursorStyle();
  dropIndicator.emitDropEvent();
  dropIndicator.hideDropIndicator();
  draggableCopy.removeCopyFromDom();
  droppableZone.cleanListener();
  droppableSpace.cleanListener();
  scrollable.disableAutoScroll();
});


// TODO: remove during publishing
// example client usage code 
window.addEventListener("DOMContentLoaded", () => {
  const el_1h = document.getElementById("1h") as DraggableWithGetter<{msg: string, type: string}>; 
  el_1h.getDragData = () => ({msg: "hello from 1h", type: "complexObject"});
  const el_5v = document.getElementById("5v");
  el_5v?.addEventListener('swd-drop', (event: CustomEvent<DropEventDetail>) => {
    const el = event.detail.target;
    if(isDraggableWithGetter(el)) {
      console.log("Element dropped on 5v element with data: ", el.getDragData(), "at location ", event.detail.dropPos);
    }
  })

  const el_4h = document.getElementById("4h");
  el_4h?.addEventListener('swd-drop', (event: CustomEvent<DropEventDetail>) => {
    const el = event.detail.target;
    if(isDraggableWithGetter(el)) {
      console.log("Element dropped on 4h element with data: ", el.getDragData(), "at location ", event.detail.dropPos);
    }
  })
})
