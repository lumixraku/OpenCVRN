import { BASE_SCENE, GAME_SCENE, EF_SCENE, UI_SCENE } from "./constants";
import { Scene } from "phaser";
import UIScene from "./UI/UIManager";
import EffectScene from "./UI/EffectManager";

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;

export default class BaseScene extends Phaser.Scene {

    private dialogScene: UIScene

    constructor() {
        super(BASE_SCENE)
    }


    init() {

    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: '/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }
    create() {
        this.scene.launch(GAME_SCENE)
        this.scene.launch(EF_SCENE)
        this.scene.launch(UI_SCENE)
        // this.scene.launch(UI_SCENE).start();
        // this.scene.launch(EF_SCENE);        


        // this.scene.launch(UI_SCENE)
        // this.scene.launch(UI_SCENE).start();
        // this.scene.launch(EF_SCENE);
        
        // this.dialogScene.showWelcome()
        // this.effScene.addHammer()
        this.dialogScene = this.scene.get(UI_SCENE) as UIScene
        // this.effScene = this.scene.get(EF_SCENE) as EffectScene

        // 此刻调用提示 rexUI undefined
        // this.dialogScene.createGetCaughtDialog(stageWidth/2, stageHeight/2) 

    }


}