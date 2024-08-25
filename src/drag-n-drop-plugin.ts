import DraggableZone from './browser/draggable-zone';
import { DroppableIndicator } from './browser/droppable';
import DroppableZone from './browser/droppable-zone';
import DraggableFollowMouse from './browser/make-copy-follow-mouse';
import './index.css';
import { extractDropZone, extractTargetElement, resetGlobalCursorStyle, setGlobalCursorStyleToMove } from './util/utils';


const draggableZone = new DraggableZone();
const droppableZone = new DroppableZone();

const followMouse = new DraggableFollowMouse();
const droppable = new DroppableIndicator();


droppableZone.onHovering((event) => {
  droppable.showDropIndicator(event);
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
  droppable.hideDropIndicator();
  droppableZone.cleanListener();
});

