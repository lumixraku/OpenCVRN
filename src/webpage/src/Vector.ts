class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number){
        this.x = x
        this.y = y
    }

    add(v: Vector2) {
        this.x = this.x + v.x
        this.y = this.y + v.y
    }

}

export { Vector2 }