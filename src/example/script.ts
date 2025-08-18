import { DraggableWithGetter, dragNDropPlugin, DropEventDetail, isDraggableWithGetter } from "..";
import "./style.css";


dragNDropPlugin.enablePlugin();

const drop2 = document.getElementById("drop2");
drop2?.addEventListener("swd-drop", (event: CustomEvent<DropEventDetail>) => {
  const el = event.detail.target;
  if (isDraggableWithGetter(el)) {
    console.log("Element dropped on drop2 with data:", el.getDragData(), "at location", event.detail.dropPos);
  }
});



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



const exampleBtn = document.getElementById("example-btn") as HTMLElement & {showComplexExample: boolean};
exampleBtn.showComplexExample = false;
const root = document.documentElement;
root.style.setProperty('--show-simple-example', 'block');
root.style.setProperty('--show-complex-example', 'none');


exampleBtn?.addEventListener("click", () => {
  if(exampleBtn.showComplexExample) {
    exampleBtn.textContent = "show complex example";
    root.style.setProperty('--show-simple-example', 'block');
    root.style.setProperty('--show-complex-example', 'none');
  }
  else {
    exampleBtn.textContent = "show simple example";
    root.style.setProperty('--show-simple-example', 'none');
    root.style.setProperty('--show-complex-example', 'block');
  }
  exampleBtn.showComplexExample = !exampleBtn.showComplexExample;
});