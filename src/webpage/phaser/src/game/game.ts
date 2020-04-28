import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import Text = Phaser.GameObjects.Text;


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
    public spSpinSpeed: number = 1;


    public distanceAngle: number = 60  //食物和食物之间的间隔(角度)
    public tableCapacity: number = 360 / this.distanceAngle; //根据间隔计算得到的桌面容量

    public foodList: Food[] = [...Array(this.tableCapacity)].map(_ => null);

    // mouth
    public mouthRect: Rectagle = new Rectagle(0, 0, 0, 0);
    public mouthContourPoints: Point[];
    public mouthContour: Graphics;
    private mouthColor: Graphics;


    // 旋转圆心
    public circleRadius: number = stageWidth
    public circleCenter: Point = new Point(stageWidth / 2, stageHeight + this.circleRadius/2.3);

    // background
    public bg: Graphics;
    public bgImg: Image;


    //text
    public mouthStateText: Text;

    constructor() {
        super('demo');

    }

    preload() {

        // yarn run dev 的时候 这个资源也还是从 dist 中读取的
        this.load.image('bgImg', 'assets/kitchen.png');
        this.load.image('pinWheel', 'assets/pinWheel.png');
        this.load.image('light', 'assets/light.png');

        this.load.image('food0', 'assets/burger.png');
        this.load.image('food1', 'assets/burrito.png');
        this.load.image('food2', 'assets/cheese-burger.png');
        this.load.image('food3', 'assets/chicken-leg.png');
        this.load.image('food4', 'assets/french-fries.png');
        this.load.image('food5', 'assets/donut.png');

        this.load.image('dogFront', 'assets/front.png');
        this.load.image('dogBack', 'assets/back.png');


        this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        this.load.glsl('stars', 'assets/starfields.glsl.js');


    }

    create() {
        this.bg = this.add.graphics()

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

        this.drawBackground()
        this.drawWheel()



        // this.light = this.add.image(0, 0, 'light');
        // this.point = new Phaser.Geom.Point(this.light.x, this.light.y)
        this.refreshMouth([])
        this.messageListener()
        this.addText();
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
        this.spSpin.angle += this.spSpinSpeed;
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
        if (!this.mouthContour) {
            this.mouthContour = this.add.graphics()

        }



        this.mouthContourPoints = points
        let mouthPoints = points;

        let xVals = mouthPoints.map(p => {
            return p.x
        })
        let yVals = mouthPoints.map(p => {
            return p.y
        })

        let minX = Math.min(...xVals)
        let maxX = Math.max(...xVals)
        let minY = Math.min(...yVals)
        let maxY = Math.max(...yVals)

        this.mouthContour.clear()
        this.mouthContour.lineStyle(5, 0xFF00FF, 1.0);
        this.mouthContour.beginPath();

        let idx = 0
        for (let p of mouthPoints) {
            if (idx == 0) {
                this. mouthContour.moveTo(p.x, p.y);
            }else {
                this.mouthContour.lineTo(p.x, p.y);
            }
            idx++

        }
        this.mouthContour.closePath();
        this.mouthContour.strokePath();

        this.mouthRect.setPosition(minX, minY);
        this.mouthRect.setSize(maxX - minX, maxY - minY)
        // if (!this.mouthColor) {
        //     this.mouthColor = this.add.graphics({ fillStyle: { color: 0x0000ff } });
        // }


        // this.mouthColor.clear()
        // this.mouthColor.fillStyle(0x0000ff)
        // this.mouthColor.fillRectShape(this.mouth)

    }

    messageListener() {
        window.addEventListener("message", (event) => {
            let oneFaceData: FaceData = event.data

            let mouthPoints = [...oneFaceData.upperLipBottom, ...oneFaceData.lowerLipTop]
            let newPoints = this.offsetPoints(stageWidth, stageHeight, mouthPoints)

            this.refreshMouth(newPoints)

        }, false)
    }
    private previewWidth = 198
    private previewHeight = 352
    private previewOffsetX = 170
    private previewOffsetY = 250
    offsetPoints(webviewWidth: number,  webviewHeight, mouthPoints: Point[]) {
        let scaleX = webviewWidth / this.previewWidth;
        let scaleY = webviewHeight / this.previewHeight;

        let newPoints = mouthPoints.map( p => {
            return new Point(p.x + this.previewOffsetX, p.y + this.previewOffsetY )
        })
        return newPoints
    }


    checkMouthClose() {
        // return false
        let isClose = false
        if (this.mouthRect.height < 10 && this.mouthRect.height / this.mouthRect.width < 0.5){
            isClose = true
        }

        this.mouthStateText.text = "" + this.mouthRect.height //isClose ? "close" : "open"

        return isClose

    }

    checkIfCouldEat() {
        if (this.checkMouthClose()) {
            return
        }

        let mouthCenterX = this.mouthRect.x + this.mouthRect.width / 2;
        let mouthCenterY = this.mouthRect.y + this.mouthRect.width / 2;

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
                (this.mouthRect.x - 100  < foodx  && foodx < this.mouthRect.x + this.mouthRect.width + 100) &&
                (this.mouthRect.y - 200 < food.y && foody < this.mouthRect.y + this.mouthRect.height + 200) &&
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

    drawHollowBackground() {
        let faceCenter = new Point(300, 450)
        let faceRadius = 200
        this.bg.beginPath()
        this.bg.moveTo(0,0)
        this.bg.lineTo(stageWidth, 0)
        this.bg.lineTo(stageWidth, faceCenter.y)
        this.bg.lineTo(faceCenter.x + faceRadius, faceCenter.y)
        this.bg.arc(faceCenter.x, faceCenter.y, faceRadius, 0, Math.PI , true);
        this.bg.lineTo(0, faceCenter.y)
        this.bg.lineTo(0,0)
        this.bg.fillStyle(0xffeeff)
        this.bg.fill()


        this.bg.moveTo(stageWidth, stageHeight)
        this.bg.lineTo(stageWidth, faceCenter.y)
        this.bg.arc(faceCenter.x, faceCenter.y, faceRadius, 0, Math.PI, false);
        this.bg.lineTo(0, faceCenter.y)
        this.bg.lineTo(0, stageHeight)
        this.bg.lineTo(stageWidth, stageHeight)
        this.bg.fillStyle(0xffeeff)
        this.bg.fill()
    }

    drawBackground(){
        this.bgImg = this.add.image(0, 0, 'bgImg')
        let bd: Rectagle = this.bgImg.getBounds()

        this.bgImg.setPosition(0,0)
        // Phaser 中 Image 的默认 pivot 就是图片的中心点

        this.bgImg.x = stageWidth/2
        this.bgImg.y = stageHeight/2
        this.bgImg.setScale(stageWidth/bd.width , stageHeight/bd.height)
    }

    drawWheel(){
        this.spSpin = this.add.sprite(this.circleCenter.x, this.circleCenter.y, 'pinWheel');
        let bds:Rectagle = this.spSpin.getBounds()
        let width = bds.width

        this.spSpin.setScale(this.circleRadius / (width/2), this.circleRadius / (width/2) )

        this.circle = new Phaser.Geom.Circle(this.circleCenter.x, this.circleCenter.y, this.circleRadius);
    }

    addText() {
        this.mouthStateText = this.add.text(stageWidth - 100, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });

    }
}
