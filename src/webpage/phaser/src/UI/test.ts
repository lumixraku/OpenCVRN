import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;

class Demo extends Phaser.Scene {
    print:PhaserText
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() { 
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });      
    }

    create() {
        this.print = this.add.text(0, 580, 'Click to pop-up dialog');
        var scene = this,
            dialog = undefined;
        this.input.on('pointerdown', function (pointer) {
            var x = pointer.x,
                y = pointer.y;

            if (dialog === undefined) {
                dialog = createDialog(this, x, y, function (color) {
                    scene.add.circle(x, y, 20, color);
                    scene.print.text = 'Add object at (' + x + ',' + y + ')';
                    dialog.scaleDownDestroy(100);
                    dialog = undefined;
                });
                scene.print.text = 'Click (' + x + ',' + y + ')';
            } else if (!dialog.isInTouching(pointer)) {
                dialog.scaleDownDestroy(100);
                dialog = undefined;
            }
        }, this);
    }

    update() {}
}

var createDialog = function (scene, x, y, onClick) {
    var dialog = scene.rexUI.add.dialog({
            x: x,
            y: y,

            background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0xf57f17),

            title: scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xbc5100),
                text: scene.add.text(0, 0, 'Pick a color', {
                    fontSize: '20px'
                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),

            actions: [
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xe91e63),
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x673ab7),
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x2196f3),
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x00bcd4),
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x4caf50),
                scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xcddc39),
            ],

            actionsAlign: 'left',

            space: {
                title: 10,
                action: 5,

                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            }
        })
        .layout()
        .pushIntoBounds()
        //.drawBounds(this.add.graphics(), 0xff0000)
        .popUp(500);

    dialog
        .on('button.click', function (button, groupName, index) {
            onClick(button.fillColor);
        })
        .on('button.over', function (button, groupName, index) {
            button.setStrokeStyle(2, 0xffffff);
        })
        .on('button.out', function (button, groupName, index) {
            button.setStrokeStyle();
        });

    return dialog;
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Demo
};

var game = new Phaser.Game(config);