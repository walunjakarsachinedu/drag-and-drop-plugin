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

// type IndicatorPositionData = {
//   element: SwdZoneElmentData;
//   mouseData: MouseData; 
//   offset: Offset;
// }

export {SwdZoneElmentData, MouseData, Offset, SwdEvent};

