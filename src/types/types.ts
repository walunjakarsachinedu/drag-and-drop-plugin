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

type AreaMap = {
  top: number[];
  right: number[];
  bottom: number[];
  left: number[]; 
  cover: number[];
};

export {
  AreaMap,
  DropIndicatorMode,
  MouseData,
  Offset,
  Point,
  SwdEvent,
  SwdEventWithTarget,
  SwdZoneElmentData
};

