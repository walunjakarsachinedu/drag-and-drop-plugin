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

  /**
   * Enables the drag and drop plugin.
   * Sets up all drag and drop zones, event listeners, and utilities.
   * Should be called once to start using the library's drag and drop features.
   */
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

  /**
   * Disables the drag and drop plugin.
   * Cleans up all event listeners, DOM elements, and resources used by the plugin.
   * After calling this, drag and drop features of this library will be inactive.
   */
  disablePlugin() {
    draggableZone.clean();
    droppableZone.clean();
    droppableSpace.clean();
    
    draggableCopy.removeCopyFromDom();
    dropIndicator.hideDropIndicator();
    scrollable.disableAutoScroll();
  }
}


/**
 * Singleton instance of the DragNDropPlugin.
 * Users should import this and call `enablePlugin()` or `disablePlugin()` as needed.
 * Plugin is disabled by default.
 */
const dragNDropPlugin = new DragNDropPlugin();

export { dragNDropPlugin };


