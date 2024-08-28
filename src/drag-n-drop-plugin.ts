import DraggableZone from './browser/draggable-zone';
import DroppableZone from './browser/droppable-zone';
import DraggableFollowMouse from './browser/draggable-follow-mouse';
import './index.css';
import { extractDropZone, extractTargetElement, resetGlobalCursorStyle, setGlobalCursorStyleToMove } from './util/utils';
import { DropIndicator } from './browser/droppable-indicator';


const draggableZone = new DraggableZone();
const droppableZone = new DroppableZone();

const followMouse = new DraggableFollowMouse();
const dropIndicator = new DropIndicator();


droppableZone.onHovering((event) => {
  dropIndicator.showDropIndicator(event);
});


draggableZone.onDragStart((event) => {
  setGlobalCursorStyleToMove();
  followMouse.addElemCopyToDom(extractTargetElement(event));
  droppableZone.listenToDroppableZone(extractDropZone(event));
});

draggableZone.onDragMove((event) => {
  followMouse.makeElmFollowMouse(event);
});

draggableZone.onDragEnd(() => {
  resetGlobalCursorStyle();
  followMouse.removeCopyFromDom();
  dropIndicator.hideDropIndicator();
  droppableZone.cleanListener();
});

