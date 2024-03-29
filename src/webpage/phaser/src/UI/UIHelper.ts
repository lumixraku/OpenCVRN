
import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;
import Container = Phaser.GameObjects.Container
import { Scene } from "phaser";
import { UI_SCENE } from "@root/constants";

export { UIHelper, ImageButton }



class UIHelper {

    /**
     * 
     * @param scene parent scene
     * @param size size of rectangle
     * @param radius 
     * @param color mainColor
     * @param borderWidth 
     * @param outerColor border Color (little darken than main color)
     */
    public static drawRoundRectWithBorder(scene: Scene, size: Rectagle, radius: number, color: any, borderWidth?: number, outerColor?: any) {


        let bg = scene.add.graphics()
        bg.clear()
        bg.beginPath()

        let x = size.x
        let y = size.y
        let width = size.width
        let height = size.height
        bg.fillStyle(outerColor)
        // graphics 的 origin 是左上角
        bg.fillRoundedRect(x, y, width, height, radius)

        if (borderWidth) {
            let x2 = x + borderWidth
            let y2 = y + borderWidth
            bg.fillStyle(color)
            bg.fillRoundedRect(x2, y2, width - 2 * borderWidth, height - 2 * borderWidth, radius - borderWidth)
        }

        return bg

    }



    public static createImageButton(scene: Scene, x: number, y: number, texture: string, callback?: Function, noframes?: boolean): ImageButton {
        return new ImageButton(scene, x, y, texture, callback, noframes)
    }

    public static fadeToStartScene(newScene: string, currentScene:Scene){
        currentScene.cameras.main.fadeOut(250);
        currentScene.time.addEvent({
            delay: 250,
            callback: function () {
                currentScene.scene.start(newScene);
            },
            callbackScope: currentScene
        });        
    }


    public static fadeToAddAnotherScene(newScene:string, currentScene: Scene) {
        // 先把目标场景显示
        currentScene.scene.get(newScene).cameras.main.fadeIn(0);

        // 当前场景慢慢淡出
        currentScene.cameras.main.fadeOut(250);
        currentScene.time.addEvent({
            delay: 250,
            callback: function () {
                // if (!currentScene.scene.isActive(newScene) && 
                //     !currentScene.scene.isPaused(newScene) &&
                //     !currentScene.scene.isSleeping(newScene)
                // ) {
                //     currentScene.scene.launch(newScene)
                // }else {
                //     if (currentScene.scene.isSleeping(newScene)) {
                //         currentScene.scene.wake(newScene);
                //     }                    
                // }
                currentScene.scene.switch(newScene)
            },
            callbackScope: currentScene
        });                
    }

    public static fadeToPrevScene(resumeScene: string, currentScene: Scene) {
        currentScene.scene.get(resumeScene).cameras.main.fadeIn(0);


        currentScene.cameras.main.fadeOut(250);
        currentScene.time.addEvent({
            delay: 250,
            callback: function () {
                // currentScene.scene.sleep(currentScene.scene.key);
                currentScene.scene.switch(resumeScene)
            },
            callbackScope: currentScene
        });        
    }

}







class ImageButton extends Phaser.GameObjects.Image {
    constructor( scene: Scene,  x:number, y:number, texture:string, callback?: Function, noframes?: boolean) {
        super(scene, x, y, texture, 0);
        this.setInteractive({ useHandCursor: true });

        this.on('pointerup', function () {
            if (!noframes) {
                this.setFrame(1);
            }
        }, this);

        this.on('pointerdown', function () {
            if (!noframes) {
                this.setFrame(2);
            }
            callback.call(scene);
        }, this);

        this.on('pointerover', function () {
            if (!noframes) {
                this.setFrame(1);
            }
        }, this);

        this.on('pointerout', function () {
            if (!noframes) {
                this.setFrame(0);
            }
        }, this);
        // scene.add.existing(this);

    }
    
};