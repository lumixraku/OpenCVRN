
console.log(Phaser.AUTO)
console.log(Phaser.AUTO)


import GameScene from '@game/game'
import changeMouth from 'test'

console.log('.................')
const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;



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
changeMouth(game)