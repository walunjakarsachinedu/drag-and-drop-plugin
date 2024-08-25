import Draggable from './browser/draggable';
import MakeCopyFollowMouse from './browser/make-copy-follow-mouse';
import './index.css';
import { resetGlobalCursorStyle, setGlobalCursorStyleToMove } from './util/utils';


const draggable = new Draggable();
const followMouse = new MakeCopyFollowMouse();

draggable.onDragStart((event) => {
  setGlobalCursorStyleToMove();
  followMouse.addElemCopyToDom(event);
});

draggable.onDragMove((event) => {
  followMouse.makeElmFollowMouse(event);
});

draggable.onDragEnd(() => {
  resetGlobalCursorStyle();
  followMouse.removeCopyFromDom();
});

