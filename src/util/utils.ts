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

export {clearTextSelection, setGlobalCursorStyleToMove, resetGlobalCursorStyle};