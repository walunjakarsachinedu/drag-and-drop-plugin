import './index.css';
import { resetGlobalCursorStyle, setGlobalCursorStyleToMove } from './util/utils';
import { SwdMouse } from './browser/utility/swd-mouse';
import { DraggableZone } from './browser/zones/draggable-zone';
import { DroppableZone } from './browser/zones/droppable-zone';
import { DraggableCopy } from './browser/components/draggable-copy';
import { DropIndicator } from './browser/components/drop-indicator';
import { DroppableSpace } from './browser/zones/droppable-space';


const draggableZone = new DraggableZone();
const droppableZone = new DroppableZone();
const droppableSpace = new DroppableSpace();

const draggableCopy = new DraggableCopy();
const dropIndicator = new DropIndicator();



droppableSpace.onHovering((event) => {
  dropIndicator.showDropIndicator(event);
});

droppableZone.onHovering((event) => {
  dropIndicator.showDropIndicator(event);
});


draggableZone.onDragStart((event) => {
  setGlobalCursorStyleToMove();
  draggableCopy.addElemCopyToDom(event.target.elementRef);
  droppableZone.listenToDroppableZone(SwdMouse.extractSwdTargets(event));
  droppableSpace.listenToDropZones(SwdMouse.extractSwdTargets(event));
});

draggableZone.onDragMove((event) => {
  draggableCopy.makeElmFollowMouse(event);
});

draggableZone.onDragEnd(() => {
  resetGlobalCursorStyle();
  draggableCopy.removeCopyFromDom();
  dropIndicator.hideDropIndicator();
  droppableZone.cleanListener();
  droppableSpace.cleanListener();
});

