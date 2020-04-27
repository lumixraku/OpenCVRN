import * as PIXI from 'pixi.js'
import * as Phaser from 'phaser'
import * as TWEEN from '@tweenjs/tween.js'
import { Vector2 } from '@game/Vector'
import { FaceData } from '@root/faceData'
import { IResourceDictionary, ITextureDictionary } from 'pixi.js';
import CircleTable from '@game/CircleTable'
import Mouth from '@game/Mouth'
import Food from '@game/Food'



const Application = PIXI.Application;
const Container = PIXI.Container;
const loader = PIXI.loader;
const resources = PIXI.loader.resources;
const TextureCache = PIXI.utils.TextureCache;
const Sprite = PIXI.Sprite;


const stageHeight = document.body.clientHeight;
const stageWidth = document.body.clientWidth;


class EatGame {
    app: PIXI.Application;
    foodList: Array<Food>;
    foodMovingList: Array<Food> //移动向嘴巴的列表
    // mouthOpen: boolean;
    mouthText: PIXI.Text;
    mouth: Mouth;
    table: CircleTable;

    score: number = 0;
        scoreText: PIXI.Text;

    constructor() {
        let app = new PIXI.Application({
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            antialias: true,
            transparent: true,
            resolution: 1
        }
        );
        this.app = app;

        this.makeScene = this.makeScene.bind(this)
        document.body.appendChild(app.view);


        this.loadRes(() => {
            this.makeScene()
            this.foodList = new Array<Food>();
            this.foodMovingList = new Array<Food>();


            let ct = new CircleTable(stageWidth / 2, stageHeight, 200)
            ct.draw(this.app.stage)
            this.table = ct


            // 初始化
            let defaultPos = new Vector2(-100, -100)
            // this.mouth = new Mouth(defaultPos, defaultPos, defaultPos)
            this.mouth = new Mouth([])

            this.app.stage.addChild(this.mouth);

            // this.score = 0
            this.renderScore()


            // 收尾
            this.renderTestText()

        })
    }
    testTween() {
        let resourceMap = resources["/images/animals.json"].textures;
        //The cat
        let cat = new Sprite(resourceMap["cat.png"]);
        cat.position.x = 16
        cat.position.y = 16
        this.app.stage.addChild(cat)

        let dest = new Vector2(200, 200)
        new TWEEN.Tween({ x: cat.x, y: cat.y })
            .to({ x: dest.x, y: dest.y }, 500)
            .onUpdate((o: any) => {
                cat.y = o.y
                cat.x = o.x
            })
            .easing(TWEEN.Easing.Cubic.In)
            // .repeat(Infinity)
            // .yoyo(true) //到了终点之后 再动画返回原点
            .start()
            .onComplete((e) => {
                this.app.stage.removeChild(cat)
            })
    }


    testSpin() {
        let resourceMap = resources["/images/animals.json"].textures;
        //The cat
        let cat = new Sprite(resourceMap["cat.png"]);
        cat.position.x = 16
        cat.position.y = 16
        this.app.stage.addChild(cat)
        cat.pivot.x = cat.getBounds().x
        cat.pivot.y = cat.getBounds().y

        let rotation = 0

        let count = 0
        let setPosFn = (deg) => {

            let pos = this.table.degreeToPos(deg)
            // let deg = 315
            cat.x = pos.x
            cat.y = pos.y

        }
        this.app.ticker.add(delta => {
            rotation += 0.1 * delta;

            let deg = rotation % 360
            setPosFn(deg)
        });




    }

    elapse = 0
    genFoodGap = 60
    frameCount = 0
    makeScene() {
        this.app.ticker.add(delta => this.gameUILoop(delta));
        this.app.ticker.add(delta => this.gameCheckLoop(delta));
        // this.testSpin()

    }


    gameCheckLoop(delta) {

        //60帧 加一次食物
        if (this.frameCount > this.genFoodGap) {

            this.addMoreFood()
            this.updateMouthState()

            this.frameCount = 0
        }
        this.reachBottomLineCat()
        this.shouldIEat();
    }


    gameUILoop(delta) {
        this.elapse++;
        this.frameCount++;

        TWEEN.update();
        this.table.startSpin(delta)
        // this.movingFood()
        this.movingFoodOnTable(delta)
    }

    loadRes(callback) {
        loader
            .add("/images/animals.json")
            .add('/images/pinwheel.png')
            .load(callback);
    }




    addMoreFood() {
        console.log("more food")
        // 桌上最多 6个 食物
        if (this.foodList.length >= 6) {
            return
        }

        let app = this.app
        let food = new Food()

        food.x = -1000
        food.y = -1000 + Math.random() * 30
        // food.visible = false


        this.foodList.push(food)
        app.stage.addChild(food)

    }

    movingFood() {
        for (let food of this.foodList) {
            if (food.transform) {
                if (!food.eating) {
                    food.y += (3 + Math.random() * 3)

                }
            }

            //miss
            if (this.mouth.missedFood(new Vector2(food.x, food.y) ) && !food.miss) {
                food.miss = true
                food.changeTexture()
                // let resourceMap = resources["/images/animals.json"].textures;
                // food.texture = resourceMap["hedgehog.png"]
            }
        }
    }

    /**
     * 食物转圈圈
     * @param delta
     */
    movingFoodOnTable(delta) {
        const foodInTable = (food): boolean => {
            return food.transform && !food.eating
        }
        for (let food of this.foodList) {

            // 逆时针旋转
            if (foodInTable(food)) {
                food.degree += delta

                let pos = this.table.degreeToPos(food.degree)
                food.position.x = pos.x
                food.position.y = pos.y
            }
        }

    }

    reachBottomLineCat() {
        for (let i = 0; i < this.foodList.length; i++) {
            let food = this.foodList[i] as PIXI.Sprite;
            if (food.y >= stageHeight + 400) {

                food.destroy()
                this.foodList.splice(i--, 1)
            }
        }
    }

    // call Each Frame
    shouldIEat() {
        if (this.mouth && this.mouth.checkMouthOpenByContour().rs) {

            for (var i = 0; i < this.foodList.length; i++) {
                let food = this.foodList[i]
                if (food && food.transform) {
                    // 调用过 sprite.destroy 之后 sprite下的transform 就是空了
                    let mouthRect = this.mouth.getMouthRect()

                    if ( this.mouth.isNearMouth( new Vector2(food.x, food.y) ) && !food.eating) {
                        this.foodList.splice(i--, 1);
                        let mouthCenter = this.mouth.getMouthCenter()
                        this.eatingFood(food, mouthCenter)

                    }
                }
            }
        }
    }

    eatingFood(food: Food, dest: Vector2) {
        // let leftTopPos = food.centerPosToLeftTopPos(dest.x, dest.y)
        // 注意应该使图片的中心位置移动到 dest
        food.eating = true
        new TWEEN.Tween({ x: food.x, y: food.y })
            .to({ x: dest.x, y: dest.y }, 1000)
            .onUpdate((o: any) => {
                food.y = o.y
                food.x = o.x
            })
            .easing(TWEEN.Easing.Quintic.Out)
            // .repeat(Infinity)
            // .yoyo(true) //到了终点之后 再动画返回原点
            .start()
            .onComplete((e) => {
                food.destroy()
                this.app.stage.removeChild(food)
                this.finishEating()

            })
    }

    updateMouthState() {
        // 这里还会有一些其他条件  待补充
        // if  (Math.random() > 0.4) {
        //     this.mouthText.text = "OPEN"
        //     this.mouthOpen = true;
        // }else {
        //     this.mouthText.text = "CLOSE"
        //     this.mouthOpen = false;
        // }
        // let rs = this.mouth.checkOpenRs()
        // this.mouthText.text = "" + rs.val
    }

    finishEating() {


        this.score++;
        this.renderScore();
    }

    renderScore() {
        if (!this.scoreText) {
            this.scoreText = new PIXI.Text(`Score: ${this.score}`, new PIXI.TextStyle({
                fontFamily: "Futura",
                fontSize: 24,
                fill: "red"
            }))
            this.scoreText.x = stageWidth - 100
            this.scoreText.y = 25
            this.app.stage.addChild(this.scoreText)
        } else {
            this.scoreText.text = `Score: ${this.score}`
        }
    }


    renderTestText() {

        let mouthText = new PIXI.Text("The End");
        this.mouthText = mouthText
        mouthText.x = 15
        mouthText.y = 15

        this.app.stage.addChild(mouthText)
    }


    public setMouthPos(faceData: FaceData) {
        // when landmarks
        let rightPos = faceData.rightMouthPosition
        let leftPos = faceData.leftMouthPosition
        let bottomPos = faceData.bottomMouthPosition

        // when contour

        if (!this.mouth) {
            // this.mouth = new Mouth(leftPos, rightPos, bottomPos)
            this.mouth = new Mouth([])
            this.app.stage.addChild(this.mouth);
        } else {
            // this.mouth.refreshByNewContours(faceData.face)
            this.mouth.refreshByNewContours(faceData)
        }

    }
}


export default EatGame
