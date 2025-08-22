## SWD Drag & Drop

A flexible drag-and-drop plugin using declarative HTML attributes. Supports both position-based and area-based drops.

**See Live Demo**: https://drag-and-drop-plugin.vercel.app/

### Installation 
If you use npm:
```bash
npm i drag-and-drop-plugin
```

### Quick Start
Enable the plugin and use HTML attributes:

```ts
import { dragNDropPlugin } from 'drag-and-drop-plugin';

// Enable the drag-and-drop plugin globally
dragNDropPlugin.enablePlugin(); 
```

### Usage

#### Drag Element Attributes

- `data-swd-targets` (required): Space-separated list of zones this element can be dropped into.
- `data-swd-target-drag-point`: Restricts dragging to a child with a matching `data-swd-drag-point`.
- `data-swd-drag-point`: Marks a child element as a valid drag handle. Should be defined on a child element of the draggable.

#### Container Attribute
Represents a container for drag and drop elements.
- `data-swd-space`: Captures mouse events in the empty space around drop zones.

#### Drop Element Attributes

- `data-swd-zones` (required): Space-separated zones this element accepts drops from.
- `data-swd-offset`: Format `<side>:<offset in px>`, e.g., `top:10,left:10`. Default: `top:10,bottom:10,right:10,left:10`.
  - Applies only in Position mode (not Area mode) and defines offset from each side when placing an element.
- `data-swd-mode`: `area` or `position`. Default: `position`.
  - Defines how drops are handled: `area` replaces a region, while `position` inserts an element.
- `data-swd-area` (Area mode): `left`, `right`, `top`, `bottom`, `cover`. Default: `cover`.
  - Specifies which part of the drop zone accepts the drop (e.g., left side, top side, or full cover).
- `data-swd-position` (Position mode): `horizontal` or `vertical`. Default: `horizontal`.
  - Determines how elements are placed: horizontal (before/after) or vertical (above/below).

##### Note: 
- You can only drop an element if the target region is visible.
- If a drop is not possible/allowed on the hovered element, the drop indicator will appear on the nearest valid region.


#### Drop Event

On a successful drop, a CustomEvent named swd-drop is dispatched. <br>
The event includes:
- target: the dragged element
- dropPos: the drop position. (Possible values: `"vt" | "vb" | "hl" | "hr" | "al" | "ar" | "at" | "ab" | "ac"`)
  - `v` = vertical, `h` = horizontal, `l` = left, `r` = right, `t` = top, `b` = bottom, `a` = area, `c` = cover

Example:
```ts
import { dragNDropPlugin, isDraggableWithGetter, type DraggableWithGetter, type DropEventDetail } from 'drag-and-drop-plugin';

dragNDropPlugin.enablePlugin(); 

const drag = document.getElementById("drag") as DraggableWithGetter<{ msg: string; type: string }>;
drag.getDragData = () => ({ msg: "hello from drag", type: "complexObject" });

const dropZone = document.getElementById("dropZone");
dropZone?.addEventListener("swd-drop", (event: CustomEvent<DropEventDetail>) => {
  const el = event.detail.target;
  if (isDraggableWithGetter(el)) { // ensures el has getDragData
    console.log("Element dropped on dropZone with data:", el.getDragData(), "at location", event.detail.dropPos);
  }
});
```
> Tip: For safe data transfer, define a getDragData function on draggable elements using the DraggableWithGetter type. On drop targets, use isDraggableWithGetter to verify that event.detail.target has getDragData before using it.
<br>

#### Full Example
<details>
  <summary>index.html</summary>

  ```html
  <div>
    <div data-swd-space>
      <!-- can be dropped on both "Drop Location 1" & "Drop Location 2" -->
      <div id="drag1" class="box" data-swd-targets="zone1 zone2" data-swd-target-drag-point="handle">
        <div>drag1</div>
        <div class="box-handle" data-swd-drag-point="handle">Drag Me</div>
      </div>

      <!-- can be dropped only on "Drop Location 2" -->
      <div id="drag2" class="box" data-swd-targets="zone2">
        <div>drag2</div>
        Drag me too
      </div>

      <!-- drop zones -->
      <div id="drop1" class="box" data-swd-zones="zone1">
        <div>drop1</div>
        Drop Location 1
      </div>
      <div id="drop2" class="box" data-swd-zones="zone2">
        <div>drop2</div>
        Drop Location 2
      </div>
    </div>
    <br><br>
    <div class="txt">Note: drag1 can be dropped on both drop1 & drop2, while drag2 can only be dropped on drop2</div>
  </div>
  ```
</details>

<details>
  <summary>main.ts</summary>
  
  ```typescript
  import './style.css'
  import { dragNDropPlugin, isDraggableWithGetter, type DraggableWithGetter, type DropEventDetail } from 'drag-and-drop-plugin';


  dragNDropPlugin.enablePlugin();

  window.addEventListener("DOMContentLoaded", () => {
    const drag1 = document.getElementById("drag1") as DraggableWithGetter<{ msg: string; type: string }>;
    drag1.getDragData = () => ({ msg: "hello from drag1", type: "complexObject" });

    const drop1 = document.getElementById("drop1");
    drop1?.addEventListener("swd-drop", (event: CustomEvent<DropEventDetail>) => {
      const el = event.detail.target;
      if (isDraggableWithGetter(el)) {
        console.log("Element dropped on drop1 with data:", el.getDragData(), "at location", event.detail.dropPos);
      }
    });

    const drop2 = document.getElementById("drop2");
    drop2?.addEventListener("swd-drop", (event: CustomEvent<DropEventDetail>) => {
      const el = event.detail.target;
      if (isDraggableWithGetter(el)) {
        console.log("Element dropped on drop2 with data:", el.getDragData(), "at location", event.detail.dropPos);
      }
    });
  });
  ```
</details>

<details>
  <summary>style.css</summary>

  ```css
  .box {
    height: 100px;
    width: 100px;
    background-color: gray;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-family: monospace;
  }

  [data-swd-space] {
    border: solid grey 1px;
    display: flex;
    flex-wrap: wrap;
  }

  #drag1 {
    position: relative;
  }

  .box-handle {
    height: 20px;
    background-color: green;
  }
  ```
</details>
