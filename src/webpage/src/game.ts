import * as PIXI from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js'
import { Vector2 } from './Vector'
console.log("pixi......", PIXI)
const Application = PIXI.Application;
const Container = PIXI.Container;
const loader = PIXI.loader;
const resources = PIXI.loader.resources;
const TextureCache = PIXI.utils.TextureCache;
const Sprite = PIXI.Sprite;


const stageHeight = document.body.clientHeight;
const eatPosY = stageHeight/2; //超过这个点还没有吃到的话  视为miss

class EatGame {
    app: PIXI.Application;
    catList: Array<PIXI.Sprite>;
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

        this.catList = new Array<PIXI.Sprite>();
        app.ticker.add(delta => this.gameLoop(delta));




    }
    gameLoop(delta) {
        TWEEN.update();

        this.moreCats(delta)
        this.movingCat()
        this.reachBottomLineCat()
        this.shouldIEat();

    }

    loadRes(callback) {
        loader
            .add("/images/animals.json")
            .load(callback);
    }

    makeScene() {
        this.addCat()
    }

    // 不断的生成猫猫
    elapse = 0
    moreCats(delta) {
        this.elapse += delta
        if (this.elapse > 60) {
            this.elapse = 0
            this.addCat()
        }
    }



    addCat() {
        let app = this.app
        let resourceMap = resources["/images/animals.json"].textures;
        //The cat
        let cat = new Sprite(resourceMap["cat.png"]);
        cat.position.set(16, 16);
        this.catList.push(cat)
        app.stage.addChild(cat)
    }

    movingCat() {
        for (let cat of this.catList){

            if ( cat.transform  ) {
                cat.y += 6
            }
            // console.log("cat", cat.y)
        }
    }

    reachBottomLineCat() {
        for (let i=0; i<this.catList.length; i++ ) {
            let cat = this.catList[i] as PIXI.Sprite;
            if (cat.y >= stageHeight - cat.height) {
                console.log('miss')
                
                cat.destroy()
                this.catList.splice(i--, 1)
            }
        }
    }

    // 寻找当前列表中第一个不是 miss 的cat
    getFirstAvailableCat() {
        for(let cat of this.catList) {
            if (!cat["miss"]) {
                return cat
            }
        }
        return null
    }

    // call Each Frame
    shouldIEat() {
        let firstCat = this.getFirstAvailableCat() as PIXI.Sprite;
        if (firstCat){

            // 调用过 sprite.destroy 之后 sprite下的transform 就是空了
            if (firstCat && firstCat.transform && firstCat.y > eatPosY ) {
                let openMouthPropability 
                if ( !firstCat["propability"] ) {
                    firstCat["propability"] = Math.random()
                }
                openMouthPropability = firstCat["propability"]

                if (openMouthPropability > 0.5) {
                    let cat = this.catList.pop()
                    console.log("eat", cat.y);
                    this.eatCat(cat, new Vector2(200, 300))

                    //miss
                }else {
                    let resourceMap = resources["/images/animals.json"].textures;
                    firstCat["miss"] = true
                    firstCat.texture = resourceMap["hedgehog.png"]                    
                }
            }
        }
    }

    eatCat(cat: PIXI.Sprite, dest: Vector2) {
        new TWEEN.Tween({ x: cat.x, y: cat.y })
            .to({ x: dest.x, y: dest.y }, 900 + Math.random() * 200)
            .onUpdate((o: any) => {
                cat.y = o.y
                cat.x = o.x
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            // .repeat(Infinity)
            // .yoyo(true) //到了终点之后 再动画返回原点
            .start()
            .onComplete( (e)=> {
                console.log("eat finish", cat)
                cat.destroy()
                this.app.stage.removeChild(cat)
            } )


    }
}


export default EatGame
