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
  style.innerHTML = `* { cursor: move !important; }`;
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

function extractDropZone(event: MouseEvent): string|undefined {
  return extractTargetElement(event)?.dataset.swdTargets;
}

function hasCommonElement(arr1: String[], arr2: String[]) :boolean {
  return arr1.some((element) => arr2.includes(element));
}



export {
  clearTextSelection, 
  setGlobalCursorStyleToMove, 
  resetGlobalCursorStyle,
  extractTargetElement,
  extractDropZone,
  hasCommonElement,
};