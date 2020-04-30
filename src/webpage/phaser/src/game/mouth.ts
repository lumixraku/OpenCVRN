import PhaserImage = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Circle = Phaser.Geom.Circle;
import Point = Phaser.Geom.Point;
import Rectagle = Phaser.Geom.Rectangle;
import Graphics = Phaser.GameObjects.Graphics;
import PhaserText = Phaser.GameObjects.Text;

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;

export default class Mouth {
    public mouthRect: Rectagle = new Rectagle(0, 0, 0, 0);
    public mouthAllPoints: Point[];
    public upperTopPoints: Point[];
    public upperBottomPoints: Point[];
    public lowerTopPoints: Point[];
    public lowerBottomPoints: Point[];

    public mouthContour: Graphics;
    public mouthStateText: PhaserText;

    // private mouthColor: Graphics;

    constructor(scene: Phaser.Scene) {
        this.mouthContour = scene.add.graphics()
        this.mouthStateText = scene.add.text(stageWidth - 100, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });
    }

    setMouthContourPoints(upperTop: Point[], upperBottom: Point[], lowerTop: Point[], lowerBottom: Point[]){
        this.upperTopPoints = upperTop;
        this.upperBottomPoints = upperBottom;
        this.lowerTopPoints = lowerTop;
        this.lowerBottomPoints = lowerBottom;

        this.mouthAllPoints = [...upperTop, ...upperBottom, ...lowerTop, ...lowerBottom]
        this.calcMouthRect()
        this.drawContour()
    }
    calcMouthRect(){
        let mouthPoints = this.mouthAllPoints;

        let xVals = mouthPoints.map(p => {
            return p.x
        })
        let yVals = mouthPoints.map(p => {
            return p.y
        })

        let minX = Math.min(...xVals)
        let maxX = Math.max(...xVals)
        let minY = Math.min(...yVals)
        let maxY = Math.max(...yVals)

        this.mouthRect.setPosition(minX, minY);
        this.mouthRect.setSize(maxX - minX, maxY - minY)
    }
    drawContour(){
        let mouthPoints = this.mouthAllPoints;
        this.mouthContour.clear()
        this.mouthContour.lineStyle(5, 0xFF00FF, 1.0);
        this.mouthContour.beginPath();

        let idx = 0
        for (let p of mouthPoints) {
            if (idx == 0) {
                this.mouthContour.moveTo(p.x, p.y);
            } else {
                this.mouthContour.lineTo(p.x, p.y);
            }
            idx++

        }
        this.mouthContour.closePath();
        this.mouthContour.strokePath();
    }

    checkIfMouthClose() {
        // return false
        let isClose = false
        if (this.mouthRect.height < 20 && this.mouthRect.height / this.mouthRect.width < 0.5) {
            isClose = true
        }

        this.mouthStateText.text = "" + this.mouthRect.height //isClose ? "close" : "open"

        return isClose        
    }

    // 得到嘴巴中心点 用于确定动画结束的位置
    getMouthCenter(): Point{
        let mouthCenterX = this.mouthRect.x + this.mouthRect.width / 2;
        let mouthCenterY = this.mouthRect.y + this.mouthRect.width / 2;

        return new Point(mouthCenterX, mouthCenterY);
    }
}