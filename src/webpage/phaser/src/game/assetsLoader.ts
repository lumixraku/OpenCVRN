import { Scene } from "phaser";



export default class AssetsLoader {
    scene: Scene
    constructor(scene: Scene) {
        this.scene = scene

    }

    loadPics() {
        let scene = this.scene;
        // yarn run dev 的时候 这个资源也还是从 dist 中读取的
        scene.load.image('bgImg', 'assets/kitchen.png');
        scene.load.image('table', 'assets/table.png');
        scene.load.image('light', 'assets/light.png');

        scene.load.image('food0', 'assets/burger.png');
        scene.load.image('food1', 'assets/burrito.png');
        scene.load.image('food2', 'assets/cheese-burger.png');
        scene.load.image('food3', 'assets/chicken-leg.png');
        scene.load.image('food4', 'assets/french-fries.png');
        scene.load.image('food5', 'assets/donut.png');

        scene.load.image('doglook', 'assets/front.png');
        scene.load.image('dogcook', 'assets/back.png');

        this.loadDogeAnimation()
    }

    loadDogeAnimation() {
        let scene = this.scene
        let endIndex = 47
    
        for(let idx = 0; idx<= endIndex; idx++) {
            let idxStr = (idx < 10) ? '0' + idx : '' + idx
            let fname = `assets/dogeFrame/frame_${idxStr}_delay-0.04s.gif`
            let keyname = `dogeFrame${idx}`;

            scene.load.image(keyname, fname)

        }
    }
}