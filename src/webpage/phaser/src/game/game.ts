import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;



const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientWidth / 9 * 16;
// 在 RN 中得到的宽和高 是411 * 823
// 在 webview 得到的宽高是 412 * 804  // 因为我的APP 并没有打开全屏
import { MSG_TYPE_FACE, MSG_TYPE_CAM, MSG_TYPE_WEBVIEW_READY, GAME_SCENE, UI_SCENE, EF_SCENE, CHECKING_DURATION, FIRST_CHECK_ELAPSE, ASSETS_SCENE, SETTINGS_SCENE, DISTANCE_ANGLE, FOOD_LIST_FNAME_MAP } from '@root/constants';
import { isPC } from '@root/test'


import Mouth from '@game/mouth'
import Food from '@game/food'
import { FaceData, Bounds } from '@root/faceData';
import SpinTable from './spinTable';
import CamFaceCheck, { FaceInCircle } from './facePosCheck';
import Cook from './cook';
import { UIPlugin } from 'UI';
import { Scene } from 'phaser';
import GameUIScene from '@root/UI/GameUIScene';
import EffectScene from '@root/UI/EffectScene';
import AssetsLoader from './assetsLoader';
import AnimateManager from './animate';
import { UIHelper, ImageButton } from '@root/UI/UIHelper';
import GameSoundManager from './soundManager';
import GameUI from './gameUILayer';
import GameEffectContainer from './gameEffect';


export default class Demo extends Phaser.Scene {
    public assetsLoader: AssetsLoader
    public animateManager: AnimateManager
    public timer: Phaser.Time.TimerEvent
    public score: number = 0


    // // 旋转圆心
    public spinTable: SpinTable
    public spSpinSpeed: number = 1;

    public distanceAngle: number = DISTANCE_ANGLE  //食物和食物之间的间隔(角度)
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
    public mouthStateText: PhaserText;
    private toastText: PhaserText
    private fpsText: PhaserText;
    // private scoreText: PhaserText
    private testText: PhaserText
    private hasCaughtToast: boolean

    

    // preview 取景器
    private previewArea: Rectagle = new Rectagle(0, 0, 0, 0)

    // scene
    private uiScene: GameUIScene;
    private effScene: EffectScene;

    private gameUILayer: GameUI
    private gameEffLayer: GameEffectContainer


    constructor() {
        super(GAME_SCENE);
        this.messageListener()
    }

    preload() {
        console.log('game preload')
        // this.scene.launch(EF_SCENE)
        // this.scene.launch(UI_SCENE)
    }


    // preload 中的资源都加载完毕之后 才会调用 create
    create() {
        console.log('game create')
        GameSoundManager.initMusic(this)


        // setTimeout(() => {
        //     this.scene.launch(SETTINGS_SCENE)


        //     setTimeout(  ()=> {
        //         this.scene.sendToBack(SETTINGS_SCENE)
        //     }, 500)
        // }, 500);


        // this.scene.get(UI_SCENE).events.on('afterCreate', ()=> {
        //     (<GameUIScene>this.scene.get(UI_SCENE)).showWelcome()
        // })





        this.timer = this.time.addEvent({
            // delay: 500,                // ms
            // callback: callback,
            //args: [],
            // callbackScope: thisArg,
            loop: true
        });



        this.drawBackground()
        this.addCook()
        this.addFace()
        this.drawWheel()

        // Phaser会根据 add 的先后顺序决定层级.
        this.mouthObj = new Mouth(this);
        this.refreshMouth([], [], [], [])


        this.addText();

        // this.uiScene = this.scene.get(UI_SCENE) as GameUIScene
        // this.effScene = this.scene.get(EF_SCENE) as EffectScene
        this.gameUILayer = new GameUI(this, 0, 0)
        this.add.existing(this.gameUILayer)
        this.gameUILayer.setDepth(10)
        
        this.gameEffLayer =  new GameEffectContainer(this, 0, 0 )
        this.add.existing(this.gameEffLayer)
        this.gameEffLayer.setDepth(20)


        this.animateManager = new AnimateManager(this)
        this.animateManager.registerAnimation()

        this.addScore = this.addScore.bind(this)



        // Main Scene
        this.cameras.main.fadeIn(250);
    }


    private frameCounter = 0
    update(time, delta) {
        console.log('game ')

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
        let elapsed = this.timer.getElapsedSeconds()
        this.shouldCookLookBack(elapsed)
        this.fpsText.text = this.game.loop.actualFps + ''
    }

    shouldCookLookBack(elapsed: number) {
        if (this.cook) {
            let shouldLookBack = Math.random()
            let isCooking = this.cook.isCooking()
            if (isCooking) {

                if (this.cook.checkTimeCount == 0) {
                    if (elapsed > FIRST_CHECK_ELAPSE) {
                        this.cook.lookBack()
                    }
                } else {

                    let isJustChecked = this.cook.ifJustChecked(elapsed)
                    if (!isJustChecked && shouldLookBack < 0.9) {
                        this.cook.lookBack()
                    }
                }
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
        // for (let i = 0; i < this.foodList.length; i++) {
        for (let {idx, val} of this.foodList.map( (val, idx)=> ({idx, val}) )    ) {    
            // 盘子是空的, 且恰好转到一个固定的位置. 就添加食物
            if (!val) {


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
                // let rawAngle = this.spinTable.getAngle()
                // let mathAngle = rawAngle < 0 ? 360 + rawAngle : rawAngle
                // // 只在圆圈的 0° 这个位置(也就是坐标系 x )这个位置生成新的元素.
                // // 根据目前的采样率 得不到 mathAngle 为 1 的情况, 最接近1 是 1.79°
                // if (Math.abs(mathAngle - i * this.distanceAngle) < 2) {
                //     let foodTextureKey = `food${i}`
                //     let food = this.add.image(0, 0, foodTextureKey) as Food

                //     food.name = `Food${i}`
                //     food.setScale(2)

                //     this.foodList[i] = food

                //     // console.log("angle add", rawAngle, mathAngle, food.name)
                //     // this.foodList.push(food)
                // }

                // 上面的办法虽然对于人类理解比较直观 但是phaser 操作起来却比较复杂 主要是 phaser 的坐标系划分很诡异

                let spinRad = this.spinTable.getRotation() % (2 * Math.PI)
                let foodRad = idx * this.spinTable.distanceRad
                if (Math.abs(spinRad - foodRad) < 0.02) {
                    let foodTextureKey = `food${idx}`
                    let food = this.add.sprite(0, 0, "foods", FOOD_LIST_FNAME_MAP[foodTextureKey]) as Food

                    food.name = `Food${idx}`
                    food.setScale(1)
                    this.foodList[idx] = food
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


            // let foodAngle = this.spinTable.calcFoodIAngle(i) //当前食物在桌上的角度
            // let point = this.spinTable.calcAngleToPoint(foodAngle)
            
            let foodRad = this.spinTable.calcRadByIdx(i)
            let circle = new Circle(this.spinTable.circleCenter.x, this.spinTable.circleCenter.y, this.spinTable.platePosRadius)
            let point = this.spinTable.calcRadToPoint(foodRad, circle)


            food.x = point.x
            food.y = point.y
        }
    }


    refreshMouth(upperTop: Point[], upperBottom: Point[], lowerTop: Point[], lowerBottom: Point[]) {
        if (this.mouthObj) {
            this.mouthObj.setMouthContourPoints(upperTop, upperBottom, lowerTop, lowerBottom)

        } else {
            console.warn('mouth obj has not ready')
        }

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
                    console.log("MSG_TYPE_CAM")
                    this.setCameraArea(event)

                default:
                    break;
            }
        }, false)

        // 告知 RN webview 事件绑定上了
        if (window["ReactNativeWebView"]) {
            let msg = {
                messageType: MSG_TYPE_WEBVIEW_READY,
                event: "bindMessage",
                time: +new Date
            }
            window["ReactNativeWebView"].postMessage(JSON.stringify(msg));
        }
    }

    setCameraArea(event) {
        if (this.camFaceCheck) {

            let previewArea = event.data.previewArea
            this.previewArea = previewArea
            this.camFaceCheck.setCameraArea(previewArea)
        } else {
            console.log("camFaceCheck not defined!!!")
            setTimeout(() => {
                this.setCameraArea(event)
            }, 100)
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
                (offsetYPreview < food.y && food.y < offsetYPreview + previewHeight * 1.2)
                &&
                !food.eating
            ) {
                // this.foodList.splice(i--, 1)
                this.foodList[i] = null
                this.eatingAnimation(food, destPos)



                break
            }

            // 来到了取景器右边 // 表示miss
            if (food.x > offsetXPreview + previewWidth && food.y < offsetYPreview + previewHeight * 1.2) {
                console.log('miss')
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

                // if not get caught
                if (this.cook.isCooking()) {
                    // this.effScene.addCoin(this.addScore)
                } else {
                    if (this.cook.isChecking())
                        this.caughtAnimation()

                }

            }
        })

    }

    caughtAnimation() {
        // this.effScene.addHammer(this, this.addScore)
        // this.uiScene.createCaughtText(stageWidth / 2, stageHeight / 2, () => { })

    }

    missAnimation() {

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
        this.bg = this.add.graphics()
        this.bgImg = this.add.image(0, 0, 'bgImg')
        let bd: Rectagle = this.bgImg.getBounds()

        this.bgImg.setPosition(0, 0)
        // Phaser 中 Image 的默认 pivot 就是图片的中心点

        this.bgImg.x = stageWidth / 2
        this.bgImg.y = stageHeight / 2
        this.bgImg.setScale(stageWidth / bd.width, stageHeight / bd.height)
        if (isPC) {
            this.bgImg.alpha = 0.5;
        }

    }

    drawWheel() {
        this.spinTable = new SpinTable(this, this.spSpinSpeed)
        this.spinTable.createTable()
    }

    addFace() {
        this.camFaceCheck = new CamFaceCheck(this)
    }

    addText() {
        this.fpsText = this.add.text(320, 120, '////////', {
            fontFamily: '"Roboto Condensed"',
            color: '#ffffff'
        })
        // this.mouthStateText = this.add.text(stageWidth - 100, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });
        // this.testText = this.add.text(170, 170, 'Hello World', { fontFamily: '"Roboto Condensed"' });

        // this.scoreText = this.add.text(390, 50, '0', { 
        //     fontFamily: '"Roboto Condensed"',
        //     color: 'red'
        // })

    }

    refreshFaceBounds(bounds: Bounds, facePoints: Point[]) {
        if (!this.camFaceCheck) {
            return
        }

        this.camFaceCheck.refreshFacePosition(bounds, facePoints)
        this.camFaceCheck.updatePreviewPosByTarget()


        // 脸的矫正都放在客户端做。
        // let rs: FaceInCircle = this.camFaceCheck.checkFacePosition(bounds)
        // if (rs.pass) {
        //     // this.camFaceCheck.setTargetFaceBounds(bounds)
        // }
    }

    addCook() {
        this.cook = new Cook(this, 120, 390)
        this.cook.setScale(0.7)
    }

    showScoreToast(text: string, delay: number, cb: Function) {
        let toastText = this.add.text(0, 0, '', { fontFamily: '"Roboto Condensed"' })

        toastText.x = stageWidth / 2
        toastText.y = stageWidth / 2
        toastText.text = text
        toastText.setFontSize(32)
        toastText.setColor('red')

        let dest = {
            x: 390, y: 50
        }
        setTimeout(() => {
            this.tweens.add({
                targets: toastText,
                x: dest.x,
                y: dest.y,
                scale: 0,
                duration: 1000,
                ease: 'Power3',
                onComplete: () => {
                    cb()
                    toastText.destroy()
                }
            })
        }, delay)

    }

    addScore(sc: number) {
        if (this.score == 0  && sc < 0) {
            return 
        }
        this.score = this.score + sc
        // this.effScene.scoreText.text = '' + this.score
    }


    

}
