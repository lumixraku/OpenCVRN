import { Circle } from "pixi.js";
import { Vector2 } from "./Vector";





class CirclePos extends PIXI.Circle {
    public origin: Vector2;
    constructor(x: number, y: number, radius: number) {
        super(x, y, radius)
        this.x = x
        this.y = y
        this.radius = radius
        this.origin = new Vector2(x, y)

    }

    degreeToPos(deg: number): Vector2 {
        let r = this.radius
        let pos:Vector2
        if (deg >= 0 && deg <= 90) {
            pos = new Vector2(Math.cos(deg) * r, Math.sin(deg) * r)
        }else

        if ( deg > 90 && deg <= 180) {
            deg = 180 - deg
            pos = new Vector2(-Math.cos(deg) * r, Math.sin(deg) * r)
        }else        
        if (deg > 180 && deg <=270) {
            deg = deg - 180
            pos = new Vector2(-Math.cos(deg) * r, -Math.sin(deg) * r)

        }else 
        if (deg > 270 && deg <= 360) {
            deg = 360 - deg
            pos = new Vector2(Math.cos(deg) * r, -Math.sin(deg) * r)
        }
        pos.add(this.origin)
        return pos

    }


}