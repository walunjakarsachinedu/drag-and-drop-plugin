### SWD Drag & Drop

A flexible drag-and-drop plugin using declarative HTML attributes. Supports both position-based and area-based drop.

#### Drop Element Attributes

- `data-swd-zones` (required): Space-separated zones this element accepts drops from.
- `data-swd-offset`: Format `<side>:<offset in px>`, e.g., `top:10,left:10`. Default: `top:10,bottom:10,right:10,left:10`.
- `data-swd-mode`: `area` or `position`. Default: `position`.
- `data-swd-area` (Area mode): `left`, `right`, `top`, `bottom`, `cover`. Default: `cover`.
- `data-swd-position` (Position mode): `horizontal` or `vertical`. Default: `horizontal`.

#### Container Attribute

- `data-swd-space`: Allows capturing mouse events in empty space surrounding drop zones.

#### Drag Element Attributes

- `data-swd-targets` (required): List of zones this element can be dropped into.
- `data-swd-target-drag-point`: Restrict drag to child with matching `data-swd-drag-point`.
- `data-swd-drag-point`: Defines child element as a valid drag handle.

#### Drop Event

On a successful drop, a CustomEvent named swd-drop is dispatched. The event contains draggedElement as `target` and `dropPos`.<br>
Possible values of `dropPos`: `"vt" | "vb" | "hl" | "hr" | "al" | "ar" | "at" | "ab" | "ac"`.

```ts
const event = new CustomEvent<DropEventDetail>('swd-drop', {
  detail: { target: draggedElement, dropPos },
  bubbles: true,
  cancelable: true
});
dropTarget.dispatchEvent(event);
```
> Note: For safe data transfer from a draggable to a drop target, add a getDragData function to the draggable element using the DraggableWithGetter type. On the drop target, use isDraggableWithGetter to check event.detail.target before casting it to DraggableWithGetter.
<br>

---
#### See Live Demo:
https://drag-and-drop-plugin.vercel.app/

