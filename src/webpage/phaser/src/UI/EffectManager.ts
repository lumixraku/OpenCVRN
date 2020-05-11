import { Scene } from "phaser";
import { EF_SCENE } from "@root/constants";

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;

export default class EffectScene extends Phaser.Scene { 
    public coin: PhaserImage
    public hammer:PhaserImage
    constructor() {
        super(EF_SCENE);
    }
    preload() {
        // this.load.scenePlugin({
        //     key: 'rexuiplugin',
        //     url: '/rexuiplugin.min.js',
        //     sceneKey: 'rexUI'
        // });
        this.load.image('coin', 'assets/coin.png');
        this.load.image('hammer', 'assets/hammer.png');
    }

    create(){
    }
    
    addCoin() {
        this.coin = this.add.image(stageWidth/2, stageHeight/2, 'coin')
        // this.coin.displayWidth = 64
        // this.coin.displayHeight = 64
        // scale 是根据原图的大小而言的。
        this.coin.setScale(0.1)


        let dest = {
            x: 390, y:50
        }
        this.tweens.add({
            targets: this.coin,
            scale: 0.5,
            duration: 132,
            ease: 'Power4',
            onComplete: () => {
                // cb()

                this.tweens.add({
                    targets: this.coin,
                    x: dest.x,
                    y: dest.y,
                    scale: 0,
                    duration: 432,
                    ease: 'Circ',
                    onComplete: () => {
                        // cb()
                        this.coin.destroy()
                    }
                })                 
            }            
        })
    }

    addHammer() {
        this.hammer = this.add.image(258, 327, 'hammer')
        this.hammer.setScale(0.3)
        this.hammer.rotation = 1

        this.tweens.add({
            targets: this.hammer,
            rotation: 1.5,
            duration: 232,
            yoyo: true,
            ease: 'Power3',
            onComplete: () => {
                // cb()
                this.hammer.destroy()
            }            
        })
    }

}