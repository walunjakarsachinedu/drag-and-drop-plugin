## SWD Drag & Drop

A flexible drag-and-drop plugin using declarative HTML attributes. Supports both position-based and area-based drops.

**See Live Demo**: https://drag-and-drop-plugin.vercel.app/

### Installation 
```bash
npm i drag-and-drop-plugin
```

### Get Started

**Step 1:** Enable the plugin in your JavaScript:

```typescript
import { dragNDropPlugin } from 'drag-and-drop-plugin';

// Enable the drag-and-drop plugin globally
dragNDropPlugin.enablePlugin();

// Call this to disable plugin
// dragNDropPlugin.disablePlugin();
```

**Step 2:** Add attributes to your HTML elements.

**Making Elements Draggable**

Add `data-swd-targets` to any element to make it draggable:

```html
<!-- This box can be dropped into zones named "inbox" and "archive" -->
<div data-swd-targets="inbox archive" class="draggable-item">
  Drag me anywhere!
</div>
```

**Creating Drop Zones**

Add `data-swd-zones` to create areas that accept drops:

```html
<!-- This accepts drops from elements targeting "inbox" -->
<div data-swd-zones="inbox" class="drop-area" data-swd-mode="area">
  Drop items here
</div>
```

**Container Setup**

Wrap your drag-and-drop area with `data-swd-space`:

```html
<div data-swd-space>
  <!-- All your draggable elements and drop zones go here -->
</div>
```

**Step 3:** Handle drop events (optional):
```typescript
import { isDraggableWithGetter, type DropEventDetail } from 'drag-and-drop-plugin';

// Handle drop events on the “inbox” zone
const inboxZone = document.querySelector<HTMLElement>('[data-swd-zones~="inbox"]');
inboxZone?.addEventListener('swd-drop', 
  (event: CustomEvent<DropEventDetail>) => {
    const droppedElement = event.detail.target;
    const dropPosition = event.detail.dropPos; // "vt", "hl", "ac", etc.
    
    console.log('Element dropped at position:', dropPosition);
  }
);
```

### Essential Attributes Reference

#### For Draggable Elements

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-swd-targets` | **Required.** Zones this element can drop into | `"zone1 zone2"` |
| `data-swd-target-drag-point` | Restrict dragging to specific handle | `"handle"` |
| `data-swd-drag-point` | Mark nested child element as drag handle | `"handle"` |

#### For Drop Zones

| Attribute | Purpose | Default | Options |
|-----------|---------|---------|---------|
| `data-swd-zones` | **Required.** Which draggables this accepts | - | `"zone1 zone2"` |
| `data-swd-mode` | How drops are handled | `"position"` | `"position"` or `"area"` |
| `data-swd-position` | Insert orientation (position mode) | `"horizontal"` | `"horizontal"` or `"vertical"` |
| `data-swd-area` | Drop region (area mode) | `"cover"` | `"left"`, `"right"`, `"top"`, `"bottom"`, `"cover"` |
| `data-swd-offset` | Spacing between elements & drop indicator | `"top:10,bottom:10,`<br/>`right:10,left:10"` | Custom pixel values |


#### For Container Attribute
Represents a container for drag and drop elements.
- `data-swd-space`: Captures mouse events in the empty space around drop zones.


#### Note: 
- You can only drop an element if the target region is visible.
- If a drop is not possible/allowed on the hovered element, the drop indicator will appear on the nearest valid region allowing drop on that region.


### Drop Event

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
> Tip: For safe data transfer, define a getDragData function on draggable elements using the DraggableWithGetter interface. On drop targets, use isDraggableWithGetter to verify that event.detail.target has getDragData before using it.
<br>

### Full Example
<details>
  <summary>index.html</summary>

  ```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>drag-and-drop-plugin</title>
  <link rel="stylesheet" href="style.css" />
  <script type="module" src="./src/main.ts" defer></script>
</head>
<body>

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

</body>
</html>
  ```
</details>

<details>
  <summary>main.ts</summary>
  
  ```typescript
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
body {
  font-family: monospace;
  background-color: black;
  color: white;
}

.box {
  height: 100px;
  width: 100px;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  gap: 10px;
  margin: 10px;
  text-align: center;
  border: solid rgba(100,100,100, 0.5);
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
