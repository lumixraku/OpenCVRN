import * as PIXI from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js'
import { Vector2 } from './Vector'
import { FaceData } from './faceData';
const Application = PIXI.Application;
const Container = PIXI.Container;
const loader = PIXI.loader;
const resources = PIXI.loader.resources;
const TextureCache = PIXI.utils.TextureCache;
const Sprite = PIXI.Sprite;


const stageHeight = document.body.clientHeight;
const eatPosSY = stageHeight / 2 - 100; //超过这个点还没有吃到的话  视为miss
const eatPosEY = stageHeight / 2 + 100; //超过这个点还没有吃到的话  视为miss

class Food extends PIXI.Sprite {
    eating: boolean
    moving: boolean
    miss: boolean

    constructor() {
        let resourceMap = resources["/images/animals.json"].textures;
        // new Sprite(resourceMap["cat.png"]);
        super(resourceMap["cat.png"]);
    }
}

class EatGame {
    app: PIXI.Application;
    foodList: Array<Food>;
    foodMovingList: Array<Food>
    mouthOpen: boolean;
    mouthText: PIXI.Text;

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
        food.y = 16
        this.foodList.push(food)
        app.stage.addChild(food)
        console.log("pixi......", app.stage.children)

    }

    movingFood() {
        for (let food of this.foodList) {
            if (food.transform) {
                if (!food.eating) {
                    food.y += 6

                }
            }

            //miss
            if (food.y > eatPosEY && food.miss === false) {
                let resourceMap = resources["/images/animals.json"].textures;
                food.miss = true
                food.texture = resourceMap["hedgehog.png"]
            }
        }
    }

    reachBottomLineCat() {
        for (let i = 0; i < this.foodList.length; i++) {
            let food = this.foodList[i] as PIXI.Sprite;
            if (food.y >= stageHeight - food.height) {
                console.log('miss')

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
                    if ( food.y > eatPosSY && food.y < eatPosEY) {
                        this.foodList.splice(i--, 1);
                        this.eatingFood(food, new Vector2(200, 300))
    
                    }
                }
            }
        }
    }

    eatingFood(food: Food, dest: Vector2) {
        food.eating = true
        new TWEEN.Tween({ x: food.x, y: food.y })
            .to({ x: dest.x, y: dest.y }, 1000)
            .onUpdate((o: any) => {
                food.y = o.y
                food.x = o.x
            })
            .easing(TWEEN.Easing.Cubic.In )
            // .repeat(Infinity)
            // .yoyo(true) //到了终点之后 再动画返回原点
            .start()
            .onComplete((e) => {
                console.log("eat finish", food.x, food.y)
                food.destroy()
                this.app.stage.removeChild(food)
            })
    }

    changeMouthState() {
            // 这里还会有一些其他条件  待补充
            if  (Math.random() > 0.5) {
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
        return 
    }
}


export default EatGame
