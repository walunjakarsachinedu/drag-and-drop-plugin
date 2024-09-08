import { Point } from "../types/types";

function clearTextSelection() {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges(); // Clear the selection
  }
}

// Function to set the cursor to 'move' globally
function setGlobalCursorStyleToMove() {
  const style = document.createElement('style');
  style.id = 'global-move-cursor';
  style.innerHTML = `
  /* change cursor type */
  * { cursor: move !important; }
  /* disable scroll */
  body {
  overscroll-behavior: contain;
}`;
  document.head.appendChild(style);
}

// Function to reset the cursor to default
function resetGlobalCursorStyle() {
  const style = document.getElementById('global-move-cursor');
  if (style) style.remove();
}


function extractTargetElement(event: MouseEvent) : HTMLElement|null|undefined {
  return event.target as HTMLElement|null|undefined;
}


function hasCommonElement(arr1: String[], arr2: String[]) :boolean {
  return arr1.some((element) => arr2.includes(element));
}


function isPointInRectangle(
  {topLeftPoint, bottomRightPoint, point} : 
  {topLeftPoint: Point, bottomRightPoint: Point, point: Point}
): boolean {
  return (
    point.x >= topLeftPoint.x &&
    point.y >= topLeftPoint.y &&
    point.x <= bottomRightPoint.x &&
    point.y <= bottomRightPoint.y
  );
}


function getSectionOfPoint(
  { rectPosition, rectWidth, rectHeight, point, } :
  { rectPosition: Point, rectWidth: number, rectHeight: number, point: Point, }
): number {
  const centerX = rectPosition.x + rectWidth / 2;
  const centerY = rectPosition.y + rectHeight / 2;

  const adjacentSide = point.x - centerX;
  const oppositeSide = point.y - centerY;

  const angle = Math.atan2(oppositeSide, adjacentSide);
  const adjustedAngle = angle >= 0 ? angle : angle + 2 * Math.PI;

  const section = Math.floor(adjustedAngle / (Math.PI / 4)) + 1;

  return section;
}


export {
  clearTextSelection, 
  setGlobalCursorStyleToMove, 
  resetGlobalCursorStyle,
  extractTargetElement,
  hasCommonElement,
  isPointInRectangle,
  getSectionOfPoint
};