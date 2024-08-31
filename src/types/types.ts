type SwdZoneElmentData = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type MouseData = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  dataset: DOMStringMap;
}; 

type Offset = {
  x: number;
  y: number;
}

type IndicatorPositionData = {
  element: SwdZoneElmentData;
  mouseData: MouseData; 
  offset: Offset;
}

export {SwdZoneElmentData, MouseData, Offset, IndicatorPositionData};

