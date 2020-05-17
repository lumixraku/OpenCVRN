import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;
import Container = Phaser.GameObjects.Container

import { Scene } from "phaser";






// import { isPC } from '../test'
import { isPC } from '@root/test'
import { ImageButton } from "@root/UI/UIUtil";
import { DISTANCE_ANGLE, stageWidth, stageHeight } from "@root/constants";


const angle2Rad = (angle: number) => {
    return (Math.PI / 180) * angle
}

export default class SpinTable {
    public tableContainer: Container;

    public spinTable: Sprite;


    private angleVal: number = 0;
    private rotationVal:number = 0;
    public spSpinSpeed: number = 1;
    
    public circle: Circle; //计算位置时用 并不是一个可见的对象
    public circleRadius: number = stageWidth
    public circleCenter: Point = new Point(stageWidth / 2 + 200, stageHeight + 100);    
    public platePosRadius: number = this.circleRadius * 0.9

    public distanceAngle: number = DISTANCE_ANGLE  //食物和食物之间的间隔(角度)
    public tableCapacity: number = 360 / this.distanceAngle; //根据间隔计算得到的桌面容量
    public distanceRad: number = 2 * Math.PI / this.tableCapacity
    public plates: PhaserImage[] = []


    public scene: Scene
    constructor(scene: Scene, spinSpeed: number) {
        this.spSpinSpeed = spinSpeed
        this.scene = scene
    }

    createTable(){
        this.circle = new Phaser.Geom.Circle(this.circleCenter.x, this.circleCenter.y, this.circleRadius);       
        this.tableContainer = this.scene.add.container(this.circleCenter.x, this.circleCenter.y)
        this.spinTable = this.scene.add.sprite(0, 0, 'table');
        let bds: Rectagle = this.spinTable.getBounds()
        let width = bds.width
        this.spinTable.setScale(this.circleRadius / (width / 2), this.circleRadius / (width / 2))        
        // if (isPC) {
        //     this.spinTable.alpha = 0.5

        // }
        
        
        this.tableContainer.add(this.spinTable)
        this.addPlates()
    }

    setTableCapacity(tableCapacity: number) {
        this.tableCapacity = tableCapacity
        this.distanceAngle = 360 / tableCapacity
    }

    rotateTableSlightly(){
        // 角度从x轴正方向开始算  顺时针旋转
        // rotate 是使用的弧度
        // angle 是角度
        this.angleVal += this.spSpinSpeed
        this.rotationVal += angle2Rad(this.spSpinSpeed)
        // this.spinTable.rotation = this.rotationVal
        this.tableContainer.rotation = this.rotationVal
    }

    getAngle(): number {
        return this.angleVal
    }

    getRotation(): number {
        return this.rotationVal
    }


    addPlates() {
        for (let i = 0; i < this.tableCapacity; i++) {
            let rad = this.calcRadByIdx(i)
            let circle = new Circle(0, 0, this.platePosRadius)
            let p = this.calcRadToPoint(rad, circle)
            this.plates[i] = this.scene.add.image(p.x, p.y, 'plate')
            this.plates[i].setScale(2)
            this.tableContainer.add(this.plates[i])
        }
    }


    /**
     * 计算第 i 个食物的在当前桌面上的角度
     * 桌子是顺时针旋转  但是食物的摆放顺序是逆时针
     * i starts from 0
     * @param i 
     */
    calcAngleByIndx(i: number):number {
        let rawAngle = this.getAngle()
        let angle = rawAngle + this.distanceAngle * (this.tableCapacity - i)
        return angle
            // 另外注意一下这里的 angle 按照正始终顺序旋转 在第一象限是 0 ~ -90  第二象限是 -90 ~ -180
            // 第四象限是 0 ~ 90  第三象限是 90 ~ 180
    }

    /**
     * 计算第 i 个食物的在当前桌面上的角度
     * 桌子是顺时针旋转  但是食物的摆放顺序是逆时针
     */
    calcRadByIdx(i) {
        let rawRad = this.rotationVal
        let rad = rawRad + this.distanceRad * (this.tableCapacity - i)
        return rad
    }

    calcAngleToPoint(angle:number):Point{
        let point = new Phaser.Geom.Point(0, 0)
        Phaser.Geom.Circle.CircumferencePoint(this.circle, angle2Rad(angle), point);
        return point
    }

    // 默认是以桌面半径计算位置 
    // 但是有时候半径会不一样  比如盘子和食物
    calcRadToPoint(rad: number, circle?: Circle): Point {
        if (!circle) {
            circle = this.circle
        }

        let point = new Phaser.Geom.Point(0, 0)
        Phaser.Geom.Circle.CircumferencePoint(circle, rad, point);
        return point        
    }
}