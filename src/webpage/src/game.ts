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
// 这两个点的位置应该由嘴巴来决定
// const eatPosSY = stageHeight / 2 - 100; //超过这个点还没有吃到的话  视为miss
// const eatPosEY = stageHeight / 2 + 100; //超过这个点还没有吃到的话  视为miss


class Mouth extends PIXI.Graphics {
    leftPos: Vector2
    rightPos: Vector2
    bottomPos: Vector2
    constructor(leftPos: Vector2, rightPos: Vector2, bottomPos: Vector2){
        super()
        this.leftPos = leftPos
        this.rightPos = rightPos
        this.bottomPos = bottomPos
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
        this.endFill();
    }    

    getTopLine() {
        let topY = Math.min(this.leftPos.y, this.rightPos.y) - 100
        return topY
    }

    getBottomLine() {
        let bottomY = Math.max(Math.max(this.leftPos.y, this.rightPos.y), this.bottomPos.y)  + 100
        return bottomY;           
    }

    getXPos() {
        return this.bottomPos.x
    }

    getYPos(){
        // return (this.getTopLine() + this.getBottomLine() )/2
        return this.bottomPos.y;
            
        
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
    constructor() {
        let resourceMap = resources["/images/animals.json"].textures;
        super(resourceMap["cat.png"]);
        this.textures = resourceMap
        // new Sprite(resourceMap["cat.png"]);
        this.bounds = this.getBounds()
        this.width = this.bounds.width
        this.height = this.bounds.height
    }

    changeTexture() {
        this.texture = this.textures["hedgehog.png"]
    }

    setCenterPos(x: number, y: number) {
        this.x = x - this.width/2
        this.y = y - this.height/2
        
    }

    centerPosToLeftTopPos(x: number, y: number): Vector2{
        return new Vector2(x - this.width / 2, y - this.height / 2)
    }
}

class EatGame {
    app: PIXI.Application;
    foodList: Array<Food>;
    foodMovingList: Array<Food>
    mouthOpen: boolean;
    mouthText: PIXI.Text;
    mouth: Mouth;

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
        this.loadRes(this.makeScene)

        this.foodList = new Array<Food>();
        this.foodMovingList = new Array<Food>();
        this.renderText()



    }
    testTween(){
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


    makeScene() {
        // this.addCat()
        this.testTween()
        this.app.ticker.add(delta => this.gameLoop(delta));

    }

    elapse = 0
    gameLoop(delta) {
        TWEEN.update();

        this.elapse++ ;
        this.movingFood()
        if (this.elapse > 60) {
            this.elapse = 0
            this.addMoreFood()
            this.changeMouthState()
        }

        this.reachBottomLineCat()
        this.shouldIEat();


    }

    loadRes(callback) {
        loader
            .add("/images/animals.json")
            .load(callback);
    }




    addMoreFood() {
        let app = this.app
        let food = new Food()
        food.x = 16
        food.y = 16 + Math.random() * 30

        this.foodList.push(food)
        app.stage.addChild(food)

    }

    movingFood() {
        for (let food of this.foodList) {
            if (food.transform) {
                if (!food.eating) {
                    food.y += (3 + Math.random()* 3)

                }
            }

            //miss
            if (food.y > this.mouth.getBottomLine() && !food.miss ) {
                console.log("miss")
                food.miss = true
                food.changeTexture()
                // let resourceMap = resources["/images/animals.json"].textures;
                // food.texture = resourceMap["hedgehog.png"]
            }
        }
    }

    reachBottomLineCat() {
        for (let i = 0; i < this.foodList.length; i++) {
            let food = this.foodList[i] as PIXI.Sprite;
            if (food.y >= stageHeight - food.height) {

                food.destroy()
                this.foodList.splice(i--, 1)
            }
        }
    }

    // call Each Frame
    shouldIEat() {        
        if (this.mouthOpen) {
            for (var i = 0; i < this.foodList.length; i++) {
                let food = this.foodList[i]
                if (food && food.transform ) {
                    // 调用过 sprite.destroy 之后 sprite下的transform 就是空了
                    if ( food.y > this.mouth.getTopLine() && food.y < this.mouth.getBottomLine()) {
                        this.foodList.splice(i--, 1);
                        let mouthPos = new Vector2(this.mouth.getXPos(), this.mouth.getYPos())
                        this.eatingFood(food, mouthPos)
    
                    }
                }
            }
        }
    }

    eatingFood(food: Food, dest: Vector2) {
        let leftTopPos = food.centerPosToLeftTopPos(dest.x, dest.y)
        // 注意应该使图片的中心位置移动到 dest
        food.eating = true
        new TWEEN.Tween({ x: food.x, y: food.y })
            .to({ x: leftTopPos.x, y: leftTopPos.y }, 1000)
            .onUpdate((o: any) => {
                food.y = o.y
                food.x = o.x
            })
            .easing(TWEEN.Easing.Cubic.In )
            // .repeat(Infinity)
            // .yoyo(true) //到了终点之后 再动画返回原点
            .start()
            .onComplete((e) => {
                // console.log("eat finish", food.x, food.y)
                food.destroy()
                this.app.stage.removeChild(food)
            })
    }

    changeMouthState() {
            // 这里还会有一些其他条件  待补充
            if  (Math.random() > 0.0) {
                this.mouthText.text = "OPEN"
                this.mouthOpen = true;
            }else {
                this.mouthText.text = "CLOSE"
                this.mouthOpen = false;
            }
    }

    renderText() {
                
        let mouthText = new PIXI.Text("The En", new PIXI.TextStyle({
            fontFamily: "Futura",
            fontSize: 64,
            fill: "red"
        }));
        this.mouthText = mouthText
        mouthText.x = 15
        mouthText.y = 15

        this.app.stage.addChild( mouthText)
    }


    public setMouthPos(faceData: FaceData){
        let rightPos = faceData.rightMouthPosition
        let leftPos = faceData.leftMouthPosition
        let bottomPos = faceData.bottomMouthPosition
        console.log("set mouth")
        if (!this.mouth) {
            
            this.mouth = new Mouth(leftPos,  rightPos, bottomPos)
            this.app.stage.addChild(this.mouth);
        }else{
            this.mouth.refreshByNewPoint(leftPos, rightPos, bottomPos)
        }
        
    }
}


export default EatGame
