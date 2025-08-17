import './styles.css';
import { isInDropZoneOrSpace, resetGlobalCursorStyle, setGlobalCursorStyleToMove } from './util/utils';
import { SwdMouse } from './browser/utility/swd-mouse';
import { DraggableZone } from './browser/zones/draggable-zone';
import { DroppableZone } from './browser/zones/droppable-zone';
import { DraggableCopy } from './browser/components/draggable-copy';
import { DropIndicator } from './browser/components/drop-indicator';
import { DroppableSpace } from './browser/zones/droppable-space';
import { Scrollable } from './browser/utility/scrollable';


class DragNDropPlugin {
  private draggableZone = new DraggableZone();
  private droppableZone = new DroppableZone();
  private droppableSpace = new DroppableSpace();

  private draggableCopy = new DraggableCopy();
  private dropIndicator = new DropIndicator(this.draggableCopy);

  private scrollable = new Scrollable();

  enablePlugin() {
    // clear previous setup, if any
    this.disablePlugin();

    this.draggableZone.listenToDragZones();

    this.droppableSpace.onHovering((event) => {
      if(this.scrollable.isScrolling()) {
        this.dropIndicator.hideDropIndicator();
        return;
      }
      this.dropIndicator.showDropIndicator(event);
    });

    this.droppableZone.onHovering((event) => {
      if(this.scrollable.isScrolling()) {
        this.dropIndicator.hideDropIndicator();
        return;
      }
      this.dropIndicator.showDropIndicator(event);
    });


    this.draggableZone.onDragStart((event) => {
      setGlobalCursorStyleToMove();
      this.draggableCopy.addElemCopyToDom(event.target.elementRef);
      this.droppableZone.listenToDropZones(SwdMouse.extractSwdTargets(event));
      this.droppableSpace.listenToDropZones(SwdMouse.extractSwdTargets(event));
      this.scrollable.enableAutoScroll();
    });

    this.draggableZone.onDragMove((event) => {
      this.draggableCopy.makeElmFollowMouse(event);
      if(!isInDropZoneOrSpace(event)) {
        this.dropIndicator.hideDropIndicator();
      }
    });

    this.draggableZone.onDragEnd(() => {
      resetGlobalCursorStyle();
      this.dropIndicator.emitDropEvent();
      this.dropIndicator.hideDropIndicator();
      this.draggableCopy.removeCopyFromDom();
      this.droppableZone.cleanListener();
      this.droppableSpace.cleanListener();
      this.scrollable.disableAutoScroll();
    });

  }

  disablePlugin() {
    this.draggableZone.clean();
    this.droppableZone.clean();
    this.droppableSpace.clean();
    
    this.draggableCopy.removeCopyFromDom();
    this.dropIndicator.hideDropIndicator();
    this.scrollable.disableAutoScroll();
  }
}

export { DragNDropPlugin };


