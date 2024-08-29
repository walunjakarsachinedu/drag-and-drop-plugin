import { MouseData, Offset, SwdZoneElmentData } from "../types/types";

class DropIndicator {
  dropIndicator: HTMLElement = document.createElement("div");

  constructor() {
    this.dropIndicator.classList.add('drop-indicator');
    this.dropIndicator.style.display = "none";
    document.body.appendChild(this.dropIndicator);
  }
  
  showDropIndicator(event: MouseEvent) {
    const target = event.target as HTMLElement|null|undefined;
    if(!target) return;

    const styles = window.getComputedStyle(this.dropIndicator);
    if(styles.display === 'none') this.enableTransitionAfterDelay();

    // logic to show drop indicator
    this.dropIndicator.style.display = "block";

    const height = target.offsetHeight, width = target.offsetHeight;
    const x = target.offsetLeft, y = target.offsetTop;
    const mouseX = event.pageX, mouseY = event.pageY;
    const dx = mouseX-x, dy = mouseY-y;
    const xOffset = 10, yOffset = 20;

    const swdZoneElement: SwdZoneElmentData = { x, y, width, height};
    const mouseData: MouseData = { x: mouseX, y: mouseY, dx, dy, dataset: target.dataset};
    const offset: Offset = {x: xOffset, y: yOffset};

    // Todo: add logic to show indicator different mode 
    //       specifically call different show indicator function
    this.showVertIndicator({element: swdZoneElement, mouseData: mouseData, offset: offset});
  }


  showVertIndicator({element, mouseData, offset}: {element: SwdZoneElmentData, mouseData: MouseData, offset: Offset}) {
    this.dropIndicator.style.height = `${element.height-offset.y}px`;
    this.dropIndicator.style.width = `0px`;

    const droppableWidth = this.dropIndicator.offsetWidth;
    const dropIndicatorX = (mouseData.dx < element.width/2) 
      ? (element.x - offset.x - droppableWidth/2) 
      : (element.x + offset.x + element.width - droppableWidth/2);

    this.dropIndicator.style.top = `${element.y+offset.y/2}px`;
    this.dropIndicator.style.left = `${dropIndicatorX}px`;
  }


  showHorizIndicator({element, mouseData, offset}: {element: SwdZoneElmentData, mouseData: MouseData, offset: Offset}) {
    // Todo: complete function
  }
  showAreaIndicator({element, mouseData, offset}: {element: SwdZoneElmentData, mouseData: MouseData, offset: Offset}) {
    // Todo: complete function
  }


  enableTransitionAfterDelay() {
    const styles = window.getComputedStyle(this.dropIndicator);
    const transition = styles.transition;
    this.dropIndicator.style.transition = 'none';
    setTimeout(() => {
      this.dropIndicator.style.transition = transition;
    });
  }

  
  hideDropIndicator() {
    this.dropIndicator.style.display = "none";
  }
}


export {DropIndicator};

