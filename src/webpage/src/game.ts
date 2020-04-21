import * as PIXI from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js'
import { Vector2 } from './Vector'
import { FaceData } from './faceData';
import { IResourceDictionary, ITextureDictionary } from 'pixi.js';




const Application = PIXI.Application;
const Container = PIXI.Container;
const loader = PIXI.loader;
const resources = PIXI.loader.resources;
const TextureCache = PIXI.utils.TextureCache;
const Sprite = PIXI.Sprite;




const stageHeight = document.body.clientHeight;
const stageWidth = document.body.clientWidth;

// 这两个点的位置应该由嘴巴来决定
// const eatPosSY = stageHeight / 2 - 100; //超过这个点还没有吃到的话  视为miss
// const eatPosEY = stageHeight / 2 + 100; //超过这个点还没有吃到的话  视为miss


class Mouth extends PIXI.Graphics {
    leftPos: Vector2  = new Vector2(0, 0)
    rightPos: Vector2 = new Vector2(0, 0)
    bottomPos: Vector2 = new Vector2(0, 0)
    openThreshold: number = 40

    points: Vector2[]

    // constructor(leftPos: Vector2, rightPos: Vector2, bottomPos: Vector2) {
    //     super()
    //     this.leftPos = leftPos
    //     this.rightPos = rightPos
    //     this.bottomPos = bottomPos
    // }
    constructor(points: Vector2[]) {
        super()
        this.points = points
    }


    refreshByNewContours(points: Vector2[] ) {
        this.clear()

        this.points = points
        // this.beginFill(0xFF0000, 1);
        this.lineStyle(1, 0xFF0000, 1);

        let idx = 0;
        for (let p of points) {
            if (idx ==0 ) {
                this.moveTo(p.x, p.y)
            }
            this.lineTo(p.x, p.y);
            idx++
        }
        // this.endFill();
    }

    refreshByNewPoint(leftPos: Vector2, rightPos: Vector2, bottomPos: Vector2) {
        this.clear()
        this.leftPos = leftPos
        this.rightPos = rightPos
        this.bottomPos = bottomPos
        this.beginFill(0xFF0000, 1);
        this.lineStyle(0, 0xFF0000, 1);
        this.moveTo(rightPos.x, rightPos.y);
        this.lineTo(leftPos.x, leftPos.y);
        this.lineTo(bottomPos.x, bottomPos.y);


        //draw Top Line & bottom Line
        this.beginFill(0x00FF00, 1)
        this.lineStyle(3, 0x00FF00, 1);
        this.moveTo(rightPos.x, rightPos.y - 100)
        this.lineTo(rightPos.x, rightPos.y + 100)

        this.endFill();
    }

    getTopLine() {
        let topY = 0
        // let topY = Math.min(this.leftPos.    y, this.rightPos.y) - 100
        return topY
    }

    getBottomLine() {
        let bottomY = 0
        // let bottomY = Math.max(Math.max(this.leftPos.y, this.rightPos.y), this.bottomPos.y) + 100
        return bottomY;
    }

    getXPos() {
        return this.bottomPos.x
    }

    getYPos() {        
        // return (this.getTopLine() + this.getBottomLine() )/2
        return this.bottomPos.y;


    }
    checkOpenRs() {
        let bottomY = Math.max(Math.max(this.leftPos.y, this.rightPos.y), this.bottomPos.y)
        let topY = Math.min(this.leftPos.y, this.rightPos.y)
        return {
            rs: bottomY - topY > this.openThreshold,
            val: bottomY - topY
        }
    }

    checkMouthByContour() {
        return {
            rs: true,
            val: 0
        }
    }
}

class CircleShape {
    constructor() {
        let p = new PIXI.Circle()
        // p.
    }
}

class Food extends PIXI.Sprite {
    eating: boolean
    moving: boolean
    miss: boolean
    textures: ITextureDictionary
    width: number
    height: number
    bounds: PIXI.Rectangle
    degree: number; //弧度制 45° 就用数字45 表示

    constructor() {
        let resourceMap = resources["/images/animals.json"].textures;
        super(resourceMap["cat.png"]);
        this.textures = resourceMap
        // new Sprite(resourceMap["cat.png"]);
        this.bounds = this.getBounds()
        this.width = this.bounds.width
        this.height = this.bounds.height
        this.pivot.x = this.width / 2
        this.pivot.y = this.height / 2

        this.degree = 0
    }

    changeTexture() {
        this.texture = this.textures["hedgehog.png"]
    }

    // 用 pivot 代替
    // setCenterPos(x: number, y: number) {
    //     this.x = x - this.width/2
    //     this.y = y - this.height/2

    // }

    centerPosToLeftTopPos(x: number, y: number): Vector2 {
        return new Vector2(x - this.width / 2, y - this.height / 2)
    }
}
class TT extends PIXI.Graphics {
    constructor() {
        super()
    }
}
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
            this.checkMouthState()

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
            if (food.y > this.mouth.getBottomLine() && !food.miss) {
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
        if (this.mouth && this.mouth.checkMouthByContour().rs) {
            for (var i = 0; i < this.foodList.length; i++) {
                let food = this.foodList[i]
                if (food && food.transform) {
                    // 调用过 sprite.destroy 之后 sprite下的transform 就是空了
                    if (food.y > this.mouth.getTopLine() && food.y < this.mouth.getBottomLine()) {
                        this.foodList.splice(i--, 1);
                        let mouthPos = new Vector2(this.mouth.getXPos(), this.mouth.getYPos())
                        this.eatingFood(food, mouthPos)

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

    checkMouthState() {
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
            this.mouth.refreshByNewContours(faceData.face)
        }

    }
}


export default EatGame
