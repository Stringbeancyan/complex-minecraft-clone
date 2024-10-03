export class Player {
    constructor() {
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.speed = 0.1;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
    }

    update() {
        if (this.moveForward) this.position[2] -= this.speed;
        if (this.moveBackward) this.position[2] += this.speed;
        if (this.moveLeft) this.position[0] -= this.speed;
        if (this.moveRight) this.position[0] += this.speed;
    }
}
