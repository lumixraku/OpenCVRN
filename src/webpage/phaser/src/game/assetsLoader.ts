import { Scene } from "phaser";
import { DOGCOOK, ASSETS_SCENE } from "@root/constants";
// import { DOGCOOK } from "../constants";



export default class AssetsLoader  {
    scene: Scene
    constructor(scene: Scene) {
        this.scene = scene

    }


    loadPics(scene:Scene) {
        // yarn run dev 的时候 这个资源也还是从 dist 中读取的
        // scene.load.image('bgImg', 'assets/kitchen.png');
        // scene.load.image('table', 'assets/table.png');
        // scene.load.image('light', 'assets/light.png');

        // scene.load.image('food0', 'assets/burger.png');
        // scene.load.image('food1', 'assets/burrito.png');
        // scene.load.image('food2', 'assets/cheese-burger.png');
        // scene.load.image('food3', 'assets/chicken-leg.png');
        // scene.load.image('food4', 'assets/french-fries.png');
        // scene.load.image('food5', 'assets/donut.png');

        // scene.load.image('doglook', 'assets/front.png');

        // // 应当使用 gif 中的某一帧
        // // scene.load.image('dogcook', 'assets/back.png');
        // scene.load.image(DOGCOOK, `assets/dogeFrame/frame_00_delay-0.04s.gif`)

        // this.loadEmoji()
        // this.loadDogeAnimation()
    }




    loadDogeAnimationAssets() {
        let scene = this.scene
        let endIndex = 47
    
        for(let idx = 0; idx<= endIndex; idx++) {
            let idxStr = (idx < 10) ? '0' + idx : '' + idx
            let fname = `assets/dogeFrame/frame_${idxStr}_delay-0.04s.gif`
            let keyname = `dogeFrame${idx}`;

            scene.load.image(keyname, fname)

        }
    }

    loadEmoji(){
        let scene = this.scene;
        scene.load.image('sad', `assets/sad.png`)
        scene.load.image('cry', `assets/cry.png`)
        scene.load.image('sour', `assets/sour.png`)

    }
}