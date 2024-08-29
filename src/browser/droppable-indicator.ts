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
    
    this.dropIndicator.style.height = `${height-yOffset}px`;
    this.dropIndicator.style.width = `0px`;

    const droppableWidth = this.dropIndicator.offsetWidth;
    const dropIndicatorX = (dx < width/2) 
      ? (x - xOffset - droppableWidth/2) 
      : (x + xOffset + width - droppableWidth/2);

    this.dropIndicator.style.top = `${y+yOffset/2}px`;
    this.dropIndicator.style.left = `${dropIndicatorX}px`;
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

