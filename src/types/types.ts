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
  dx: number;
  dy: number;
}; 

type Offset = {
  x: number;
  y: number;
}

type SwdEvent = {
  target: SwdZoneElmentData;
  mouseData: MouseData; 
  // offset: Offset;
}

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

export {SwdZoneElmentData, MouseData, Offset, SwdEvent, DropIndicatorMode, Point, AreaMap};

