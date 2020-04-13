import * as PIXI from 'pixi.js'
console.log("pixi......", PIXI)
const Application = PIXI.Application;
const Container = PIXI.Container;
const loader = PIXI.loader;
const resources = PIXI.loader.resources;
const TextureCache = PIXI.utils.TextureCache;
const Sprite = PIXI.Sprite;
class EatGame {
    app: PIXI.Application
    constructor() {
        let app = new PIXI.Application({
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            antialias: true,
            transparent: true,
            resolution: 1
        }
        );
        this.app =  app;

        this.makeScene = this.makeScene.bind(this)

        document.body.appendChild(app.view);
        this.loadRes(this.makeScene)
        
        
    }
    loadRes(callback){
        loader
            .add("/images/animals.json")
            .load(callback);
    }

    makeScene(){
        this.addCat()
    }

    addCat() {
        let app = this.app
        let resourceMap = resources["/images/animals.json"].textures;
        //The cat
        let cat = new Sprite(resourceMap["cat.png"]);
        cat.position.set(16, 16);
        app.stage.addChild(cat)
        
    }
}


export default EatGame






