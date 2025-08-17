import { DraggableWithGetter, DragNDropPlugin, DropEventDetail } from "..";
import { isDraggableWithGetter } from "..";


const dragNDropPlugin = new DragNDropPlugin();
dragNDropPlugin.enablePlugin();


window.addEventListener("DOMContentLoaded", () => {
  const el_1h = document.getElementById("1h") as DraggableWithGetter<{msg: string, type: string}>; 
  el_1h.getDragData = () => ({msg: "hello from 1h", type: "complexObject"});
  const el_5v = document.getElementById("5v");
  el_5v?.addEventListener('swd-drop', (event: CustomEvent<DropEventDetail>) => {
    const el = event.detail.target;
    if(isDraggableWithGetter(el)) {
      console.log("Element dropped on 5v element with data: ", el.getDragData(), "at location ", event.detail.dropPos);
    }
  })

  const el_4h = document.getElementById("4h");
  el_4h?.addEventListener('swd-drop', (event: CustomEvent<DropEventDetail>) => {
    const el = event.detail.target;
    if(isDraggableWithGetter(el)) {
      console.log("Element dropped on 4h element with data: ", el.getDragData(), "at location ", event.detail.dropPos);
    }
  })
})


const pluginBtn = document.getElementById("plugin-btn") as HTMLElement & {isPluginEnabled: boolean};
pluginBtn.isPluginEnabled = true;

pluginBtn?.addEventListener("click", () => {
  if(pluginBtn.isPluginEnabled) {
    dragNDropPlugin.disablePlugin();
    pluginBtn.textContent = "enable plugin";
  }
  else {
    dragNDropPlugin.enablePlugin();
    pluginBtn.textContent = "disable plugin";
  }
  pluginBtn.isPluginEnabled = !pluginBtn.isPluginEnabled;
});