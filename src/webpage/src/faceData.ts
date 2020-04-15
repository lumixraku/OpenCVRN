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
    bottomMouthPosition?: BottomMouthPosition;
    bounds: Bounds;
    faceID: number;
    leftCheekPosition?: LeftCheekPosition;
    leftEarPosition?: LeftEarPosition;
    leftEarTipPosition?: LeftEarTipPosition;
    leftEyeOpenProbability?: number;
    leftEyePosition?: LeftEyePosition;
    leftMouthPosition?: LeftMouthPosition;
    noseBasePosition?: NoseBasePosition;
    rightCheekPosition?: RightCheekPosition;
    rightEarPosition?: RightEarPosition;
    rightEarTipPosition?: RightEarTipPosition;
    rightEyeOpenProbability?: number;
    rightEyePosition?: RightEyePosition;
    rightMouthPosition?: RightMouthPosition;
    rollAngle: number;
    smilingProbability?: number;
    yawAngle: number;
}
