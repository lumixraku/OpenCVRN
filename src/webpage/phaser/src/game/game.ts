import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;

import Food from '@game/food'
import { FaceData } from '@root/faceData';



const angle2Rad = (angle: number) => {
    return (Math.PI / 180 ) * angle
}
export default class Demo extends Phaser.Scene {
    public spSpin: Sprite;
    public circle: Circle;
    public point: Point;
    public light: Image;

    public distanceAngle: number = 60  //食物和食物之间的间隔(角度)
    public tableCapacity: number = 360 / this.distanceAngle; //根据间隔计算得到的桌面容量

    public foodList: Food[] = [...Array(this.tableCapacity)].map(_ => null);
    public mouth: Rectagle = new Rectagle(0, 0, 0, 0);
    private mouthColor: Graphics;


    // 旋转圆心
    public circleCenter: Phaser.Geom.Point;
    public circleRadius: number = stageWidth/ 2.5


    constructor() {
        super('demo');
    }

    preload() {

        // yarn run dev 的时候 这个资源也还是从 dist 中读取的
        this.load.image('pinWheel', 'assets/pinWheel.png');
        this.load.image('light', 'assets/light.png');

        this.load.image('food0', 'assets/burger.png');
        this.load.image('food1', 'assets/burrito.png');
        this.load.image('food2', 'assets/cheese-burger.png');
        this.load.image('food3', 'assets/chicken-leg.png');
        this.load.image('food4', 'assets/french-fries.png');
        this.load.image('food5', 'assets/donut.png');


        this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create() {
        this.circleCenter = new Point(stageWidth / 2, stageHeight - this.circleRadius / 2)
        // this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        // this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);




        // this.tweens.add({
        //     targets: logo,
        //     y: 350,
        //     duration: 1500,
        //     ease: 'Sine.inOut',
        //     yoyo: true,
        //     repeat: -1
        // })


        this.circle = new Phaser.Geom.Circle(this.circleCenter.x, this.circleCenter.y, 200);

        this.spSpin = this.add.sprite(this.circleCenter.x, this.circleCenter.y, 'pinWheel');

        // this.light = this.add.image(0, 0, 'light');
        // this.point = new Phaser.Geom.Point(this.light.x, this.light.y)
        this.refreshMouth([])
        this.messageListener()
    }


    private frameCounter = 0
    update(time, delta) {

        this.rotateTable()
        this.movingFoodOnTable()
        this.checkIfCouldEat()

        // Phaser.Geom.Circle.CircumferencePoint(this.circle, this.spSpin.rotation,  this.point);
        // this.light.x = this.point.x
        // this.light.y = this.point.y

        this.frameCounter += 1

        if (this.frameCounter >= 60) {
            this.frameCounter = 0
            this.update60Frame()
        }

    }

    update60Frame() {

    }

    rotateTable() {
        // 右手顺时针
        this.spSpin.angle += 0.8;
        // rotate 是使用的弧度
        this.addFoodIfNeed()

    }


    addCounter = 0
    addFoodIfNeed() {
        for(let i =0; i < this.foodList.length; i++) {
            // i = 0 angle 0
            // i = 1 angle 60
            // 盘子是空的, 且恰好转到合适的位置. 就添加食物
            if (!this.foodList[i]) {


                //
                //               +
                //               |
                //               |
                //               |
                //   -90 ~ -180  |    0 ~ -90
                //               |
                //               |
                //               |
                //               |
                // +-----------------------------+
                //               |
                //               |
                //               |
                //     90 - 180  |     0 - 90
                //               |
                //               |
                //               |
                //               |
                //               +


                // 由于phaser 的坐标不是连续的, 因此为了按照顺时针旋转一周得到 360 的角度, 需要做下面的处理
                let mathAngle = this.spSpin.angle < 0 ? 360 + this.spSpin.angle : this.spSpin.angle

                // 根据目前的采样率 得不到 mathAngle 为 1 的情况, 最接近1 是 1.79°
                if ( Math.abs(mathAngle - i *  this.distanceAngle)  < 2) {
                    let foodTextureKey = `food${i}`
                    let food = this.add.image(0, 0, foodTextureKey) as Food

                    food.name = `Food${i}`
                    food.setScale(2,2)

                    this.foodList[i] = food

                    console.log("angle add", this.spSpin.angle, mathAngle, food.name)
                    // this.foodList.push(food)
                }
            }
        }
    }

    movingFoodOnTable() {

        for (let i = 0; i < this.foodList.length; i++) {
            let food = this.foodList[i];
            if (!food) {
                continue
            }

            let point = new Phaser.Geom.Point(0, 0)


            // 只在圆圈的 0° 这个位置(也就是坐标系 x )这个位置生成新的元素.
            let angle = this.spSpin.angle + this.distanceAngle * (this.tableCapacity  - i)
            // 另外注意一下这里的 angle 按照正始终顺序旋转 在第一象限是 0 ~ -90  第二象限是 -90 ~ -180
            // 第四象限是 0 ~ 90  第三象限是 90 ~ 180

            Phaser.Geom.Circle.CircumferencePoint(this.circle, angle2Rad(angle) , point);

            food.x = point.x
            food.y = point.y
        }
    }


    refreshMouth(points: Point[]) {
        let xVals = points.map(p => {
            return p.x
        })
        let yVals = points.map(p => {
            return p.y
        })

        let minX = Math.min(...xVals)
        let maxX = Math.max(...xVals)
        let minY = Math.min(...yVals)
        let maxY = Math.max(...yVals)

        this.mouth.setPosition(minX, minY);
        this.mouth.setSize(maxX - minX, maxY - minY)
        if (!this.mouthColor) {
            this.mouthColor = this.add.graphics({ fillStyle: { color: 0x0000ff } });
        }
        this.mouthColor.clear()
        this.mouthColor.fillStyle(0x0000ff)
        this.mouthColor.fillRectShape(this.mouth)

    }

    messageListener() {
        window.addEventListener("message", (event) => {
            let oneFaceData: FaceData = event.data

            let mouthPoints = [...oneFaceData.upperLipBottom, ...oneFaceData.upperLipTop, ...oneFaceData.lowerLipBottom, ...oneFaceData.lowerLipTop]
            this.refreshMouth(mouthPoints)

        }, false)
    }

    checkIfCouldEat() {
        let mouthCenterX = this.mouth.x + this.mouth.width / 2;
        let mouthCenterY = this.mouth.y + this.mouth.width / 2;

        let destPos = new Point(mouthCenterX, mouthCenterY)
        for (let i = 0; i < this.foodList.length; i++) {


            let food = this.foodList[i]
            if (!food) {
                continue
            }

            if (food.eating) {
                continue
            }

            let foodx = food.x
            let foody = food.y

            if (
                (this.mouth.x < foodx && foodx < this.mouth.x + this.mouth.width) &&
                (this.mouth.y < food.y && foody < this.mouth.y + this.mouth.height) &&
                !food.eating
            ) {
                // this.foodList.splice(i--, 1)
                this.foodList[i] = null
                this.eatingAnimation(food, destPos)
                break
            }
        }
    }

    eatingAnimation(food: Food, dest: Point) {
        food.eating = true
        var tween = this.tweens.add({
            targets: food,
            x: dest.x,
            y: dest.y,
            scale: 0,
            duration: 400,
            ease: 'Power3',
            onComplete: () => {
                food.destroy()
            }
        })
    }

}
