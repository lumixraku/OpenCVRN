import Point = Phaser.Geom.Point;


export interface BottomMouthPosition {
    x: number;
    y: number;
}

export interface Origin {
    x: number;
    y: number;
}

export interface Size {
    height: number;
    width: number;
}

export interface Bounds {
    origin: Origin;
    size: Size;
}

export interface LeftCheekPosition {
    x: number;
    y: number;
}

export interface LeftEarPosition {
    x: number;
    y: number;
}

export interface LeftEarTipPosition {
    x: number;
    y: number;
}

export interface LeftEyePosition {
    x: number;
    y: number;
}

export interface LeftMouthPosition {
    x: number;
    y: number;
}

export interface NoseBasePosition {
    x: number;
    y: number;
}

export interface RightCheekPosition {
    x: number;
    y: number;
}

export interface RightEarPosition {
    x: number;
    y: number;
}

export interface RightEarTipPosition {
    x: number;
    y: number;
}

export interface RightEyePosition {
    x: number;
    y: number;
}

export interface RightMouthPosition {
    x: number;
    y: number;
}

export interface FaceData {
    bounds: Bounds;
    faceID: number;
    // LandMarks
    bottomMouthPosition?: Point;
    leftCheekPosition?: Point;
    leftEarPosition?: Point;
    leftEarTipPosition?: Point;
    leftEyeOpenProbability?: number;
    leftEyePosition?: Point;
    leftMouthPosition?: Point;
    noseBasePosition?: Point;
    rightCheekPosition?: Point;
    rightEarPosition?: Point;
    rightEarTipPosition?: Point;
    rightEyeOpenProbability?: number;
    rightEyePosition?: Point;
    rightMouthPosition?: Point;
    smilingProbability?: number;


    //contours
    face? : Point[];
    lowerLipBottom?: Point[];
    lowerLipTop?: Point[];
    upperLipBottom?: Point[];
    upperLipTop?: Point[];


    rollAngle: number;
    yawAngle: number;

}
