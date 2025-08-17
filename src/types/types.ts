type SwdZoneElmentData = {
  x: number;
  y: number;
  width: number;
  height: number;
  dataset: DOMStringMap;
  elementRef: HTMLElement;
};

type MouseData = {
  x: number;
  y: number;
}; 

type Offset = {
  x: number;
  y: number;
}

// represent offset for drop indicator in px
type OffsetMap = {
  top?: number; 
  bottom?: number; 
  right?: number; 
  left?: number;
}

type SwdEvent = {
  target?: SwdZoneElmentData;
  mouseData: MouseData;
  preventDefault: () => void;
  mouseType: "touch" | "mouse";
};

/** SwdEvent with target defined. */
type SwdEventWithTarget = SwdEvent & {
  // made target required
  target: SwdZoneElmentData; 
};

type TargetAndMouseData = {
  target: SwdZoneElmentData;
  mouseData: MouseData;
}


type DropTarget = {target: SwdZoneElmentData, area: Area};

/** Detail for a drop event (e.g., `CustomEvent<DropEventDetail>`), including target element and drop position. */
type DropEventDetail = {
  target: HTMLElement;
  dropPos: Area;
}


type DropIndicatorMode = 'vertical' | 'horizontal' | 'area';

type Point = {
  x: number;
  y: number;
};

type VerticalInsertEdge = "vt" | "vb";
type HorizontalInsertEdge = "hl" | "hr"; 
type InsertEdge = VerticalInsertEdge | HorizontalInsertEdge ;
type ReplaceRegion = "al" | "ar" | "at" | "ab" | "ac";
type Area =  InsertEdge | ReplaceRegion;

type AreaMap = {
  [key in ReplaceRegion]: number[];
};

type DropEvent = SwdEvent & {
  /** possible position for placement of drop indicator such that after placing it, the indicator remain in bound. */
  placement?: Area;
};

/**
 * An HTML element that provides a getDragData method.
 * The method returns a value of type T.
 */
interface DraggableWithGetter<T> extends HTMLElement {
  getDragData: () => T;
}

declare global {
  interface HTMLElementEventMap {
    'swd-drop': CustomEvent<DropEventDetail>;
  }
}

interface DragElementGetter { 
  getDraggedElement(): HTMLElement | null; 
}

export {
  AreaMap,
  DropIndicatorMode,
  MouseData,
  Offset,
  OffsetMap,
  Point,
  SwdEvent,
  SwdEventWithTarget,
  SwdZoneElmentData,
  TargetAndMouseData,
  DropTarget,
  DropEvent,
  DropEventDetail,
  VerticalInsertEdge,
  HorizontalInsertEdge,
  InsertEdge, 
  ReplaceRegion,
  Area,
  DraggableWithGetter,
  DragElementGetter
};

