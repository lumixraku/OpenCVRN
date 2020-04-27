import * as PIXI from 'pixi.js'
import { Vector2 } from '@game/Vector'

const Application = PIXI.Application;
const Container = PIXI.Container;
const loader = PIXI.loader;
const resources = PIXI.loader.resources;
const TextureCache = PIXI.utils.TextureCache;
const Sprite = PIXI.Sprite;




class CircleTable extends PIXI.Sprite {
    origin: Vector2
    radius: number
    degree: number
    graph: PIXI.Graphics
    bounds: PIXI.Rectangle

    // x y 表示圆桌在画布上的位置
    constructor(x: number, y: number, radius: number) {
        // 这样会改变在画布中的额位置
        // this.x = x
        // this.y = y
        let tex: PIXI.Texture = resources['/images/pinwheel.png'].texture
        super(tex)

        this.origin = new Vector2(x, y)
        this.radius = radius

        this.bounds = this.getBounds()
        this.width = this.bounds.width
        this.height = this.bounds.height
        this.pivot.x = this.width / 2
        this.pivot.y = this.height / 2

        this.degree = 0

    }

    draw(parent: PIXI.Container) {
        // this.beginFill(0xFF0000, 1);
        // this.drawCircle(0, 0, this.radius); // drawCircle(x, y, radius)
        // this.endFill();    

        // x y 等 pos 坐标因为 pivot 而改变
        // 原本 x y 是指图片的左上角
        // 现在 x y 是图片的中心点
        this.x = this.origin.x// - this.width/2
        this.y = this.origin.y// - this.height/2


        // this.beginFill(0xFF0000, 1);
        // this.lineStyle(0, 0xFF0000, 1);
        // this.moveTo(200, 200);
        // this.lineTo(200, 300);
        // this.lineTo(300, 300)        

        // stage.addChild(this.applyTexture())
        parent.addChild(this)
    }


    create(): PIXI.Graphics {


        let newG = new PIXI.Graphics()
        newG.beginFill(0xe74c3c); // Red
        newG.drawCircle(this.x, this.y, this.radius);
        newG.endFill();
        this.graph = newG
        return newG
    }

    // 这个好像不对 
    // 这是在底部挖了一个洞  当graphic 移动的时候 纹理却没有移动
    apppplyTexture() {
        //create a texture
        let img = new Image();
        img.src = '/images/logo.png';
        let base = new PIXI.BaseTexture(img)
        let texture = new PIXI.Texture(base);// return you the texture        

        let tilingSprite = new PIXI.TilingSprite(texture, 0, 0);

        tilingSprite.mask = this;
        return tilingSprite

    }


    startSpin(delta) {
        this.degree += delta
        // angle 为正是顺时针旋转

        this.angle = -this.degree
        // this.rotation -= 0.01 * delta;

    }

    degreeToPos(deg: number): Vector2 {
        // Math.cos(x) 这里默认是弧度制
        // 而参数中的 deg 是角度
        // 所以要把角度转为弧度
        deg = Math.PI / 180 * deg
        let r = this.radius
        let pos: Vector2
        if (deg >= 0 && deg <= 90) {
            pos = new Vector2(Math.cos(deg) * r, Math.sin(deg) * r)
        } else if (deg > 90 && deg <= 180) {
            deg = 180 - deg
            pos = new Vector2(-Math.cos(deg) * r, Math.sin(deg) * r)
        } else if (deg > 180 && deg <= 270) {
            deg = deg - 180
            pos = new Vector2(-Math.cos(deg) * r, -Math.sin(deg) * r)

        } else if (deg > 270 && deg <= 360) {
            deg = 360 - deg
            pos = new Vector2(Math.cos(deg) * r, -Math.sin(deg) * r)
        }

        // 和数学中的坐标系不一样哎                    
        // pos.add(this.origin)
        let gamePos = new Vector2(0, 0)
        gamePos.y = this.origin.y - pos.y
        gamePos.x = this.origin.x + pos.x



        return gamePos

    }
}

export default CircleTable;
