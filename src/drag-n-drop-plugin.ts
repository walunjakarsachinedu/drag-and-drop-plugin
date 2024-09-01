import './index.css';
import { resetGlobalCursorStyle, setGlobalCursorStyleToMove } from './util/utils';
import { DropIndicator } from './browser/drop-indicator';
import { DraggableCopy } from './browser/draggable-copy';
import { DraggableZone } from './browser/draggable-zone';
import { DroppableZone } from './browser/droppable-zone';
import { SwdMouse } from './browser/swd-mouse';


const draggableZone = new DraggableZone();
const droppableZone = new DroppableZone();

const draggableCopy = new DraggableCopy();
const dropIndicator = new DropIndicator();


droppableZone.onHovering((event) => {
  dropIndicator.showDropIndicator(event);
});


draggableZone.onDragStart((event) => {
  setGlobalCursorStyleToMove();
  draggableCopy.addElemCopyToDom(event.target.elementRef);
  droppableZone.listenToDroppableZone(SwdMouse.extractSwdTargets(event));
});

draggableZone.onDragMove((event) => {
  draggableCopy.makeElmFollowMouse(event);
});

draggableZone.onDragEnd(() => {
  resetGlobalCursorStyle();
  draggableCopy.removeCopyFromDom();
  dropIndicator.hideDropIndicator();
  droppableZone.cleanListener();
});

