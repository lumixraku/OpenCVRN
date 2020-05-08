
console.log(Phaser.AUTO)
console.log(Phaser.AUTO)


import GameScene from '@game/game'
import { MSG_TYPE_FACE, MSG_TYPE_CAM, MSG_TYPE_WEBVIEW_READY} from '@root/constants';

import { changeMouth, setPreview }from 'test'

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;
setTimeout( ()=> {

    console.log('....stageWidth.', stageWidth, stageHeight)
}, 1000)

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: stageWidth,
    height: stageHeight,
    scene: GameScene,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
};
console.log("...............")
const game = new Phaser.Game(config);
// game.scene.getScene()  game.scene 是 SceneManager  getScene()才是 Phaser.Scene



setTimeout( ()=> {
    changeMouth(game)
    setPreview()
}, 0)

