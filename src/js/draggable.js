import { blocksArea } from "../index";

export default class Draggable {
    constructor(item, outer) {
        this.dragItem = item;
        this.dragItemRect = this.dragItem.getBoundingClientRect();
        this.container = outer;
        this.containerRect = this.container.getBoundingClientRect();
        this.active = false;
        this.currentX;
        this.currentY;
        this.initialX;
        this.initialY;
        this.xOffset = this.containerRect.left;
        this.yOffset = this.containerRect.top;

        this.container.addEventListener("touchstart", this.dragStart, false);
        this.container.addEventListener("touchend", this.dragEnd, false);
        this.container.addEventListener("touchmove", this.drag, false);

        this.container.addEventListener("mousedown", this.dragStart, false);
        this.container.addEventListener("mouseup", this.dragEnd, false);
        this.container.addEventListener("mousemove", this.drag, false);
    }

    dragStart = e => {
        if (e.type === "touchstart") {
            this.initialX = e.touches[0].clientX - this.containerRect.left;
            this.initialY = e.touches[0].clientY - this.containerRect.top;
        } else {
            this.initialX = e.clientX - this.containerRect.left;
            this.initialY = e.clientY - this.containerRect.top;
        }

        if (e.target === this.dragItem) {
            this.active = true;
        }
    }

    drag = e => {
        if (this.active) {
            e.preventDefault();

            if (e.type === "touchmove") {
                this.currentX = e.touches[0].clientX - this.containerRect.left;
                this.currentY = e.touches[0].clientY - this.containerRect.top;
            } else {
                this.currentX = e.clientX - this.containerRect.left;
                this.currentY = e.clientY - this.containerRect.top;

                this.currentX = this.currentX * (1 / blocksArea.scale) - (this.dragItemRect.width / 2);
                this.currentY = this.currentY * (1 / blocksArea.scale) - (this.dragItemRect.height / 2);
            }

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.setTranslate(this.currentX, this.currentY, this.dragItem);
        }
    }

    dragEnd = e => {
        this.initialX = this.currentX;
        this.initialY = this.currentY;

        this.active = false;
    }

    setTranslate = (xPos, yPos, el) => {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}