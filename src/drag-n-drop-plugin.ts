import { draggableCopy } from './browser/components/draggable-copy';
import { dropIndicator } from './browser/components/drop-indicator';
import { scrollable } from './browser/utility/scrollable';
import { SwdMouse } from './browser/utility/swd-mouse';
import { draggableZone } from './browser/zones/draggable-zone';
import { droppableSpace } from './browser/zones/droppable-space';
import { droppableZone } from './browser/zones/droppable-zone';
import './styles.css';
import { isInDropZoneOrSpace, resetGlobalCursorStyle, setGlobalCursorStyleToMove } from './util/utils';


class DragNDropPlugin {

  enablePlugin() {
    // clear previous setup, if any
    this.disablePlugin();

    draggableZone.listenToDragZones();

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

  }

  disablePlugin() {
    draggableZone.clean();
    droppableZone.clean();
    droppableSpace.clean();
    
    draggableCopy.removeCopyFromDom();
    dropIndicator.hideDropIndicator();
    scrollable.disableAutoScroll();
  }
}


/** Singleton instance to enable/disable the plugin; plugin is disabled by default. */
const dragNDropPlugin = new DragNDropPlugin();

export { dragNDropPlugin };


