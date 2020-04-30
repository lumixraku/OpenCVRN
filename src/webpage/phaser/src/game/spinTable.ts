import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;
import { Scene } from "phaser";

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;

const angle2Rad = (angle: number) => {
    return (Math.PI / 180) * angle
}

export default class SpinTable {
    public spSpin: Sprite;
    public circle: Circle; //计算位置时用 并不是一个可见的对象
    public spSpinSpeed: number = 1;

    public circleRadius: number = stageWidth
    public circleCenter: Point = new Point(stageWidth / 2, stageHeight + this.circleRadius / 2.3);    


    public distanceAngle: number = 60  //食物和食物之间的间隔(角度)
    public tableCapacity: number = 360 / this.distanceAngle; //根据间隔计算得到的桌面容量


    constructor(pos: Point, radius: number, spinSpeed: number) {
        this.circleCenter = pos
        this.circleRadius = radius
        this.spSpinSpeed = spinSpeed
    }

    addToContainer(scene: Scene){
        this.spSpin = scene.add.sprite(this.circleCenter.x, this.circleCenter.y, 'pinWheel');
        this.spSpin.alpha = 0.5

        let bds: Rectagle = this.spSpin.getBounds()
        let width = bds.width

        this.spSpin.setScale(this.circleRadius / (width / 2), this.circleRadius / (width / 2))

        this.circle = new Phaser.Geom.Circle(this.circleCenter.x, this.circleCenter.y, this.circleRadius);        
    }

    setTableCapacity(tableCapacity: number) {
        this.tableCapacity = tableCapacity
        this.distanceAngle = 360 / tableCapacity
    }

    rotateTableSlightly(){
        // 角度从x轴正方向开始算  顺时针旋转
        // rotate 是使用的弧度
        // angle 是角度
        this.spSpin.angle += this.spSpinSpeed;
    }

    getAngle(): number {
        return this.spSpin.angle
    }

    // 计算第 i 个食物的在当前桌面上的角度
    // 桌子是顺时针旋转  但是食物的摆放顺序是逆时针
    // i starts from 0
    calcFoodIAngle(i: number):number {
        let rawAngle = this.getAngle()
        let angle = rawAngle + this.distanceAngle * (this.tableCapacity - i)
        return angle
            // 另外注意一下这里的 angle 按照正始终顺序旋转 在第一象限是 0 ~ -90  第二象限是 -90 ~ -180
            // 第四象限是 0 ~ 90  第三象限是 90 ~ 180
    }

    calcAngleToPoint(angle:number):Point{
        let point = new Phaser.Geom.Point(0, 0)
        Phaser.Geom.Circle.CircumferencePoint(this.circle, angle2Rad(angle), point);
        return point
    }
}