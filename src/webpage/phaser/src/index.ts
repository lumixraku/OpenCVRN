
console.log(Phaser.AUTO)
console.log(Phaser.AUTO)


import { MSG_TYPE_FACE, MSG_TYPE_CAM, MSG_TYPE_WEBVIEW_READY, UI_SCENE, BASE_SCENE} from '@root/constants';
// import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';


const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;


import GameScene from '@game/game'
import UIScene from '@root/UI/UIScene'
import EFScene from '@root/UI/EffectScene'
import BaseScene from './BaseScene';



const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: stageWidth,
    height: stageHeight,
    scene: [ BaseScene, GameScene,EFScene, UIScene],
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    // 这个 npm 包存在问题
    // plugins: {
    //     scene: [
    //     {´´´´´´´´´´´
    //         key: 'rexUI',
    //         plugin: UIPlugin,
    //         mapping: 'rexUI'
    //     },
    //     ]
    // }    
};
const game = new Phaser.Game(config);
console.log(game.scene.isSleeping(BASE_SCENE)) 
// game.scene.add(UI_SCENE, UIManagerScene)
// game.scene.getScene()  game.scene 是 SceneManager  getScene()才是 Phaser.Scene


import { changeMouth, setPreview, testClickEvent } from 'test'

changeMouth(game)
setPreview()
testClickEvent(game)

