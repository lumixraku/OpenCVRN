import { Vector2 } from "./Vector";

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
    bottomMouthPosition?: Vector2;
    leftCheekPosition?: Vector2;
    leftEarPosition?: Vector2;
    leftEarTipPosition?: Vector2;
    leftEyeOpenProbability?: number;
    leftEyePosition?: Vector2;
    leftMouthPosition?: Vector2;
    noseBasePosition?: Vector2;
    rightCheekPosition?: Vector2;
    rightEarPosition?: Vector2;
    rightEarTipPosition?: Vector2;
    rightEyeOpenProbability?: number;
    rightEyePosition?: Vector2;
    rightMouthPosition?: Vector2;
    smilingProbability?: number;


    //contours
    face? : Vector2[];
    lowerLipBottom?: Vector2[];
    lowerLipTop?: Vector2[];
    upperLipBottom?: Vector2[];
    upperLipTop?: Vector2[];    


    rollAngle: number;
    yawAngle: number;

}
