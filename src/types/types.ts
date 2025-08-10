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

type DropEvent = SwdEventWithTarget & {
  /** possible position for placement of drop indicator such that after placing it, the indicator remain in bound. */
  placement: Area;
};


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
  DropEvent,
  VerticalInsertEdge,
  HorizontalInsertEdge,
  InsertEdge, 
  ReplaceRegion,
  Area
};

