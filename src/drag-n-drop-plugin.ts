import Draggable from './draggable';
import './index.css';
import { clearTextSelection } from './util/utils';



const draggable = new Draggable();

draggable.onDragStart(() => {
  console.log("event: dragging is started");
})
draggable.onDragMove(() => {
  clearTextSelection();
  console.log("event: moving draggable element");
})
draggable.onDragEnd(() => {
  console.log("event: dragging is ended");
})

