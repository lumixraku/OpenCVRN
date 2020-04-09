package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.ml.vision.FirebaseVision;
import com.google.firebase.ml.vision.common.FirebaseVisionImage;
import com.google.firebase.ml.vision.common.FirebaseVisionPoint;
import com.google.firebase.ml.vision.face.FirebaseVisionFace;
import com.google.firebase.ml.vision.face.FirebaseVisionFaceContour;
import com.google.firebase.ml.vision.face.FirebaseVisionFaceDetector;
import com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions;
import com.google.firebase.ml.vision.face.FirebaseVisionFaceLandmark;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactContext;
import com.google.gson.Gson;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import org.json.JSONObject;
import org.opencv.core.CvType;
import org.opencv.core.Mat;

import org.opencv.android.Utils;
import org.opencv.imgproc.Imgproc;

import android.graphics.Rect;
import android.net.Uri;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RNMLKitLibraryModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNMLKitLibraryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

    }


    @Override
    public String getName() {
        return "RNMLKitLibrary";
    }

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    @ReactMethod
    public void show(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }


    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    FirebaseVisionImage image;

    private FirebaseVisionImage imageFromPath(Context context, Uri uri) {
        // [START image_from_path]
        FirebaseVisionImage image;

        try {
            image = FirebaseVisionImage.fromFilePath(context, uri);
            return image;
        } catch (IOException e) {
            e.printStackTrace();
        }
        // [END image_from_path]
        return null;
    }

    private FirebaseVisionImage imageFromBitmap(Bitmap btImage){
            return  FirebaseVisionImage.fromBitmap(btImage);
    }

    @ReactMethod
    public void detectFacesByBase64(String imageAsBase64, Callback errorCallback, Callback successCallback) {
        try {


            Log.v("LogDemo", "detectFacesByBase64");
            BitmapFactory.Options btOptions = new BitmapFactory.Options();
            btOptions.inDither = true;
            btOptions.inPreferredConfig = Bitmap.Config.ARGB_8888;

            byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
            Bitmap btImage = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
            FirebaseVisionImage image = this.imageFromBitmap(btImage);

            // [START set_detector_options]
            FirebaseVisionFaceDetectorOptions options =
                    new FirebaseVisionFaceDetectorOptions.Builder()
                            .setClassificationMode(FirebaseVisionFaceDetectorOptions.FAST)
//                            .setLandmarkMode(FirebaseVisionFaceDetectorOptions.ALL_LANDMARKS)
                            .setContourMode(FirebaseVisionFaceDetectorOptions.ALL_CONTOURS)
//                            .setClassificationMode(FirebaseVisionFaceDetectorOptions.ALL_CLASSIFICATIONS)
                            .setMinFaceSize(0.15f)
                            .enableTracking()
                            .build();
            // [END set_detector_options]

            // [START get_detector]
            FirebaseVisionFaceDetector detector = FirebaseVision.getInstance()
                    .getVisionFaceDetector(options);

            Map<String, Object> faceDataToReact = new HashMap<String, Object>();


            long beforeDetectTime =  System.currentTimeMillis();
            // [END get_detector]

            // [START run_detector]
            Task<List<FirebaseVisionFace>> result =
                    detector.detectInImage(image)
                            .addOnSuccessListener(
                                    new OnSuccessListener<List<FirebaseVisionFace>>() {
                                        @Override
                                        public void onSuccess(List<FirebaseVisionFace> faces) {
                                            // Task completed successfully
                                            // [START_EXCLUDE]
                                            // [START get_face_info]

                                            Log.v("LogDemo", "face info " + faces.size() + " took time ::: " + (System.currentTimeMillis() - beforeDetectTime) );
                                            for (FirebaseVisionFace face : faces) {
                                                Rect bounds = face.getBoundingBox();
                                                float rotY = face.getHeadEulerAngleY();  // Head is rotated to the right rotY degrees
                                                float rotZ = face.getHeadEulerAngleZ();  // Head is tilted sideways rotZ degrees

                                                Log.v("LogDemo", "one face info " + bounds.left + " " +bounds.top + " " + bounds.width() + " " + bounds.height());
                                                faceDataToReact.put("facepos", new int[]{bounds.left,bounds.top,bounds.width(), bounds.height() });

                                                // 特征点检测
                                                FirebaseVisionFaceLandmark nodeBaseLandMark = face.getLandmark(FirebaseVisionFaceLandmark.NOSE_BASE);
                                                if (nodeBaseLandMark != null) {
                                                    FirebaseVisionPoint leftEarPos = nodeBaseLandMark.getPosition();
                                                    Log.v("LogDemo", "node pos" + leftEarPos  );
                                                }


                                                // 轮廓线检测
                                                FirebaseVisionFaceContour noseBridgeContour = face.getContour(FirebaseVisionFaceContour.NOSE_BOTTOM);
                                                if (noseBridgeContour != null){
                                                    List<FirebaseVisionPoint> noseBridgeFBPoints = noseBridgeContour.getPoints();
                                                    List<Float> noseBridgePoints = new ArrayList<Float>();
                                                    Log.v("LogDemo", "noseBridgeFBPoints size" + noseBridgeFBPoints.size() );
                                                    for (FirebaseVisionPoint nodeBridgeP: noseBridgeFBPoints) {
                                                        Log.v("LogDemo", "node pos" + nodeBridgeP);
                                                        noseBridgePoints.add(nodeBridgeP.getX());
                                                        noseBridgePoints.add(nodeBridgeP.getY());
                                                    }
                                                    faceDataToReact.put("nosepos", noseBridgePoints);
                                                }
                                                // If landmark detection was enabled (mouth, ears, eyes, cheeks, and
                                                // nose available):
                                                FirebaseVisionFaceLandmark leftEar = face.getLandmark(FirebaseVisionFaceLandmark.LEFT_EAR);
                                                if (leftEar != null) {
                                                    FirebaseVisionPoint leftEarPos = leftEar.getPosition();
                                                }

                                                // If classification was enabled:
                                                if (face.getSmilingProbability() != FirebaseVisionFace.UNCOMPUTED_PROBABILITY) {
                                                    float smileProb = face.getSmilingProbability();
                                                    Log.v("LogDemo", "smile prob " + smileProb);
                                                }
                                                if (face.getRightEyeOpenProbability() != FirebaseVisionFace.UNCOMPUTED_PROBABILITY) {
                                                    float rightEyeOpenProb = face.getRightEyeOpenProbability();
                                                }

                                                // If face tracking was enabled:
                                                if (face.getTrackingId() != FirebaseVisionFace.INVALID_ID) {
                                                    int id = face.getTrackingId();
                                                }
                                                Log.v("LogDemo", "one face info Y: " + rotY + " Z " + rotZ);


                                            }
                                            // [END get_face_info]
                                            // [END_EXCLUDE]
                                            ;
                                            Gson gson = new Gson();
                                            String jsonToReact = gson.toJson(faceDataToReact);
                                            Log.v("LogDemo", "json to react " + jsonToReact);
                                            successCallback.invoke(jsonToReact);
                                        }
                                    })
                            .addOnFailureListener(
                                    new OnFailureListener() {
                                        @Override
                                        public void onFailure(@NonNull Exception e) {
                                            // Task failed with an exception
                                            // ...
                                            errorCallback.invoke(e.getMessage());
                                        }
                                    });
            // [END run_detector]
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }




    @ReactMethod
    public void detectFacesByPath(String filePath, Callback errorCallback, Callback successCallback) {
        try {


            Log.v("LogDemo", "detectFaces");
//        Uri fileUri = Uri.fromFile(new File("/storage/emulated/0/Pictures/Screenshots/Screenshot_20200407-205233~01.jpg"));
            Uri fileUri = Uri.fromFile(new File("/storage/emulated/0/DCIM/Camera/IMG_20200408_102923~02~458800.jpg"));

            this.image = this.imageFromPath(this.reactContext, fileUri);
//            this.image = this.imageFromPath(getReactApplicationContext(), fileUri);
            Log.v("LogDemo", "this image " + this.image);

            // [START set_detector_options]
            FirebaseVisionFaceDetectorOptions options =
                    new FirebaseVisionFaceDetectorOptions.Builder()
                            .setClassificationMode(FirebaseVisionFaceDetectorOptions.FAST)
//                            .setLandmarkMode(FirebaseVisionFaceDetectorOptions.ALL_LANDMARKS)
                            .setContourMode(FirebaseVisionFaceDetectorOptions.ALL_CONTOURS)
//                            .setClassificationMode(FirebaseVisionFaceDetectorOptions.ALL_CLASSIFICATIONS)
                            .setMinFaceSize(0.15f)
                            .enableTracking()
                            .build();
            // [END set_detector_options]

            // [START get_detector]
            FirebaseVisionFaceDetector detector = FirebaseVision.getInstance()
                    .getVisionFaceDetector(options);

            Map<String, Object> faceDataToReact = new HashMap<String, Object>();


            long beforeDetectTime =  System.currentTimeMillis();
            // [END get_detector]

            // [START run_detector]
            Task<List<FirebaseVisionFace>> result =
                    detector.detectInImage(image)
                            .addOnSuccessListener(
                                    new OnSuccessListener<List<FirebaseVisionFace>>() {
                                        @Override
                                        public void onSuccess(List<FirebaseVisionFace> faces) {
                                            // Task completed successfully
                                            // [START_EXCLUDE]
                                            // [START get_face_info]

                                            Log.v("LogDemo", "face info " + faces.size() + " took time ::: " + (System.currentTimeMillis() - beforeDetectTime) );
                                            for (FirebaseVisionFace face : faces) {
                                                Rect bounds = face.getBoundingBox();
                                                float rotY = face.getHeadEulerAngleY();  // Head is rotated to the right rotY degrees
                                                float rotZ = face.getHeadEulerAngleZ();  // Head is tilted sideways rotZ degrees

                                                Log.v("LogDemo", "one face info " + bounds.left + " " +bounds.top + " " + bounds.width() + " " + bounds.height());
                                                faceDataToReact.put("facepos", new int[]{bounds.left,bounds.top,bounds.width(), bounds.height() });

                                                // 特征点检测
                                                FirebaseVisionFaceLandmark nodeBaseLandMark = face.getLandmark(FirebaseVisionFaceLandmark.NOSE_BASE);
                                                if (nodeBaseLandMark != null) {
                                                    FirebaseVisionPoint leftEarPos = nodeBaseLandMark.getPosition();
                                                    Log.v("LogDemo", "node pos" + leftEarPos  );
                                                }


                                                // 轮廓线检测
                                                FirebaseVisionFaceContour noseBridgeContour = face.getContour(FirebaseVisionFaceContour.NOSE_BOTTOM);
                                                if (noseBridgeContour != null){
                                                    List<FirebaseVisionPoint> noseBridgeFBPoints = noseBridgeContour.getPoints();
                                                    List<Float> noseBridgePoints = new ArrayList<Float>();
                                                    Log.v("LogDemo", "noseBridgeFBPoints size" + noseBridgeFBPoints.size() );
                                                    for (FirebaseVisionPoint nodeBridgeP: noseBridgeFBPoints) {
                                                        Log.v("LogDemo", "node pos" + nodeBridgeP);
                                                        noseBridgePoints.add(nodeBridgeP.getX());
                                                        noseBridgePoints.add(nodeBridgeP.getY());
                                                    }
                                                    faceDataToReact.put("nosepos", noseBridgePoints);
                                                }
                                                // If landmark detection was enabled (mouth, ears, eyes, cheeks, and
                                                // nose available):
                                                FirebaseVisionFaceLandmark leftEar = face.getLandmark(FirebaseVisionFaceLandmark.LEFT_EAR);
                                                if (leftEar != null) {
                                                    FirebaseVisionPoint leftEarPos = leftEar.getPosition();
                                                }

                                                // If classification was enabled:
                                                if (face.getSmilingProbability() != FirebaseVisionFace.UNCOMPUTED_PROBABILITY) {
                                                    float smileProb = face.getSmilingProbability();
                                                    Log.v("LogDemo", "smile prob " + smileProb);
                                                }
                                                if (face.getRightEyeOpenProbability() != FirebaseVisionFace.UNCOMPUTED_PROBABILITY) {
                                                    float rightEyeOpenProb = face.getRightEyeOpenProbability();
                                                }

                                                // If face tracking was enabled:
                                                if (face.getTrackingId() != FirebaseVisionFace.INVALID_ID) {
                                                    int id = face.getTrackingId();
                                                }
                                                Log.v("LogDemo", "one face info Y: " + rotY + " Z " + rotZ);


                                            }
                                            // [END get_face_info]
                                            // [END_EXCLUDE]
                                            ;
                                            Gson gson = new Gson();
                                            String jsonToReact = gson.toJson(faceDataToReact);
                                            Log.v("LogDemo", "json to react " + jsonToReact);
                                            successCallback.invoke(jsonToReact);
                                        }
                                    })
                            .addOnFailureListener(
                                    new OnFailureListener() {
                                        @Override
                                        public void onFailure(@NonNull Exception e) {
                                            // Task failed with an exception
                                            // ...
                                            errorCallback.invoke(e.getMessage());
                                        }
                                    });
            // [END run_detector]
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }


}