function clearTextSelection() {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges(); // Clear the selection
  }
}

export {clearTextSelection};