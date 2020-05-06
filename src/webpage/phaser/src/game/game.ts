import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;
// 在 RN 中得到的宽和高 是411 * 823
// 在 webview 得到的宽高是 412 * 804  // 因为我的APP 并没有打开全屏
import { MSG_TYPE_FACE, MSG_TYPE_CAM, MSG_TYPE_WEBVIEW } from '@root/constants';


import Mouth from '@game/mouth'
import Food from '@game/food'
import { FaceData, Bounds } from '@root/faceData';
import SpinTable from './spinTable';
import CamFaceCheck, { FaceInCircle } from './facePosCheck';
import Cook from './cook';

export default class Demo extends Phaser.Scene {
    // // 旋转圆心
    public spinTable: SpinTable
    public spSpinSpeed: number = 1;
    public circleRadius: number = stageWidth
    public circleCenter: Point = new Point(stageWidth / 2, stageHeight + this.circleRadius / 2.3);

    public distanceAngle: number = 60  //食物和食物之间的间隔(角度)
    public tableCapacity: number = 360 / this.distanceAngle; //根据间隔计算得到的桌面容量

    public foodList: Food[] = [...Array(this.tableCapacity)].map(_ => null);

    // mouth
    public mouthObj: Mouth;

    public camFaceCheck: CamFaceCheck;

    // background
    public bg: Graphics;
    public bgImg: PhaserImage;

    // cook
    public cook: Cook;


    //text
    // public mouthStateText: PhaserText;

    private previewArea: Rectagle = new Rectagle(0, 0, 0, 0)
    private testText: PhaserText

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

        this.load.image('doglook', 'assets/front.png');
        this.load.image('dogcook', 'assets/back.png');


        this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        this.load.glsl('stars', 'assets/starfields.glsl.js');

    }

    create() {
        this.bg = this.add.graphics()

        this.drawBackground()
        this.addCook()
        this.addFace()
        this.drawWheel()

        // Phaser会根据 add 的先后顺序决定层级.
        this.mouthObj = new Mouth(this);
        this.refreshMouth([], [], [], [])


        this.messageListener()
        this.addText();
    }


    private frameCounter = 0
    update(time, delta) {

        this.rotateTable()
        this.addFoodIfNeed()
        this.movingFoodOnTable()
        this.checkIfCouldEat()


        this.frameCounter += 1

        if (this.frameCounter >= 60) {
            this.frameCounter = 0
            this.update60Frame()
        }

    }

    update60Frame() {
        let shouldLookBack =  Math.random()

        if (this.cook) {
            let isDogCooking = this.cook.isCooking()

            if ( isDogCooking && shouldLookBack < 0.3) {
                this.cook.lookBack()
            }
            if (!isDogCooking) {
                setTimeout(()=>{
                    this.cook.cookAgain()
                }, 1000)
            }
        }
        
    }

    rotateTable() {
        // 右手顺时针
        // this.spSpin.angle += this.spSpinSpeed;
        this.spinTable.rotateTableSlightly()

    }

    addCounter = 0
    addFoodIfNeed() {
        for (let i = 0; i < this.foodList.length; i++) {
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
                let rawAngle = this.spinTable.getAngle()
                let mathAngle = rawAngle < 0 ? 360 + rawAngle : rawAngle
                // 只在圆圈的 0° 这个位置(也就是坐标系 x )这个位置生成新的元素.
                // 根据目前的采样率 得不到 mathAngle 为 1 的情况, 最接近1 是 1.79°
                if (Math.abs(mathAngle - i * this.distanceAngle) < 2) {
                    let foodTextureKey = `food${i}`
                    let food = this.add.image(0, 0, foodTextureKey) as Food

                    food.name = `Food${i}`
                    food.setScale(2, 2)

                    this.foodList[i] = food

                    // console.log("angle add", rawAngle, mathAngle, food.name)
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

            // let rawAngle = this.spinTable.getAngle()
            // let angle = rawAngle + this.distanceAngle * (this.tableCapacity  - i)
            // 另外注意一下这里的 angle 按照正始终顺序旋转 在第一象限是 0 ~ -90  第二象限是 -90 ~ -180
            // 第四象限是 0 ~ 90  第三象限是 90 ~ 180
            let foodAngle = this.spinTable.calcFoodIAngle(i) //当前食物在桌上的角度
            let point = this.spinTable.calcAngleToPoint(foodAngle)

            // Phaser.Geom.Circle.CircumferencePoint(this.circle, angle2Rad(angle) , point);

            food.x = point.x
            food.y = point.y
        }
    }


    refreshMouth(upperTop: Point[], upperBottom: Point[], lowerTop: Point[], lowerBottom: Point[]) {
        this.mouthObj.setMouthContourPoints(upperTop, upperBottom, lowerTop, lowerBottom)

    }

    messageListener() {
        window.addEventListener("message", (event) => {
            switch (event.data.messageType) {
                case MSG_TYPE_FACE:
                    // 不论取景器是否有偏移  这里得到的坐标就是相对于 webview 左上角而言的
                    // offset 的处理已经在 RN 的部分完成
                    let of: FaceData = event.data.faceData
                    this.refreshMouth(of.upperLipTop, of.upperLipBottom, of.lowerLipTop, of.lowerLipBottom)
                    this.refreshFaceBounds(of.bounds, of.face)

                    break;
                case MSG_TYPE_CAM:
                    setTimeout(() => {
                        console.log("MSG_TYPE_CAM")
                    }, 1000)
                    let previewArea = event.data.previewArea
                    this.previewArea = previewArea
                    this.camFaceCheck.setCameraArea(previewArea)
                default:
                    break;
            }




        }, false)

        // 告知 RN webview 事件绑定上了
        if (window["ReactNativeWebView"]) {
            let msg = {
                messageType: MSG_TYPE_WEBVIEW,
                event: "bindMessage",
                time: +new Date
            }
            window["ReactNativeWebView"].postMessage(JSON.stringify(msg));
        }
    }


    // 所有的 offset 都移动到了 RN 的部分处理
    // offsetPoints(webviewWidth: number,  webviewHeight, mouthPoints: Point[]) {
    //     let scaleX = webviewWidth / this.previewWidth;
    //     let scaleY = webviewHeight / this.previewHeight;

    //     let newPoints = mouthPoints.map( p => {
    //         return new Point(p.x + this.previewOffsetX, p.y + this.previewOffsetY )
    //     })
    //     return newPoints
    // }




    checkIfCouldEat() {
        if (this.mouthObj.checkIfMouthClose()) {
            return
        }

        if (this.previewArea.x == 0) {
            console.warn("offsetXPreview is still zero")
            return
        }
        let offsetXPreview: number = this.previewArea.x
        let offsetYPreview: number = this.previewArea.y
        let previewWidth: number = this.previewArea.width
        let previewHeight: number = this.previewArea.height


        let destPos = this.mouthObj.getMouthCenter();
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


            // 重新修改判定条件
            // 当food 在摄像头范围内就可以吃
            if (
                (offsetXPreview < food.x && food.x < offsetXPreview + previewWidth)
                &&
                (offsetYPreview < food.y && food.y < offsetYPreview + previewHeight)
                &&
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
        this.bg.moveTo(0, 0)
        this.bg.lineTo(stageWidth, 0)
        this.bg.lineTo(stageWidth, faceCenter.y)
        this.bg.lineTo(faceCenter.x + faceRadius, faceCenter.y)
        this.bg.arc(faceCenter.x, faceCenter.y, faceRadius, 0, Math.PI, true);
        this.bg.lineTo(0, faceCenter.y)
        this.bg.lineTo(0, 0)
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

    drawBackground() {
        this.bgImg = this.add.image(0, 0, 'bgImg')
        let bd: Rectagle = this.bgImg.getBounds()

        this.bgImg.setPosition(0, 0)
        // Phaser 中 Image 的默认 pivot 就是图片的中心点

        this.bgImg.x = stageWidth / 2
        this.bgImg.y = stageHeight / 2
        this.bgImg.setScale(stageWidth / bd.width, stageHeight / bd.height)
        this.bgImg.alpha = 0.5;
    }

    drawWheel() {
        this.spinTable = new SpinTable(this.circleCenter, this.circleRadius, this.spSpinSpeed)
        this.spinTable.addToContainer(this)
    }

    addFace() {
        this.camFaceCheck = new CamFaceCheck(this)
    }

    addText() {
        // this.mouthStateText = this.add.text(stageWidth - 100, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });
        this.testText = this.add.text(170, 170, 'Hello World', { fontFamily: '"Roboto Condensed"' });
    }

    refreshFaceBounds(bounds: Bounds, facePoints: Point[]) {   
        this.camFaceCheck.refreshFacePosition(bounds, facePoints)  
        this.camFaceCheck.updatePreviewPosByTarget()

        let rs: FaceInCircle = this.camFaceCheck.checkFacePosition(bounds)
        if (rs.pass) {
            this.camFaceCheck.setTargetFaceBounds(bounds)
        }
    }

    addCook() {
        this.cook = new Cook(this, 100, 400)
    }
}
