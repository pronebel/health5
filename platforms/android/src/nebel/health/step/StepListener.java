package nebel.health.step;

import java.util.List;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

public class StepListener extends CordovaPlugin implements SensorEventListener {

    public static int STOPPED = 0;
    public static int STARTING = 1;
    public static int RUNNING = 2;
    public static int ERROR_FAILED_TO_START = 3;

    int status; // status of listener
    long lastAccessTime;

    public static int CURRENT_SETP = 0;

    public static float SENSITIVITY = 0; // SENSITIVITY灵敏度

    private float mLastValues[] = new float[3 * 2];
    private float mScale[] = new float[2];
    private float mYOffset;
    private static long end = 0;
    private static long start = 0;

    /**
     * 最后加速度方向
     */
    private float mLastDirections[] = new float[3 * 2];
    private float mLastExtremes[][] = { new float[3 * 2], new float[3 * 2] };
    private float mLastDiff[] = new float[3 * 2];
    private int mLastMatch = -1;

    // /////////////////
    private SensorManager sensorManager;// Sensor manager
    Sensor mSensor; // Compass sensor returned by sensor manager

    private CallbackContext callbackContext;

    /**
     * 传入上下文的构造函数
     * 
     * @param context
     */
    public StepListener(Context context) {
	// TODO Auto-generated constructor stub
	super();
	int h = 480;
	mYOffset = h * 0.5f;
	mScale[0] = -(h * 0.5f * (1.0f / (SensorManager.STANDARD_GRAVITY * 2)));
	mScale[1] = -(h * 0.5f * (1.0f / (SensorManager.MAGNETIC_FIELD_EARTH_MAX)));

    }

    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
	super.initialize(cordova, webView);
	this.sensorManager = (SensorManager) cordova.getActivity()
		.getSystemService(Context.SENSOR_SERVICE);
    }

    @Override
    public boolean execute(String action, JSONArray args,
	    CallbackContext callbackContext) throws JSONException {
	if (action.equals("start")) {
	    this.start();
	} else if (action.equals("stop")) {
	    this.stop();
	} else if (action.equals("getStatus")) {

	} else {

	    return false;
	}
	return true;
    }

    public void onDestroy() {

    }

    public void onReset() {

    }

    // /////////////////// Local Method//////////////////////////////////////////////////////////////////////////////

    public int start() {
	// If already starting or running, then just return
	if ((this.status == StepListener.RUNNING)
		|| (this.status == StepListener.STARTING)) {
	    return this.status;
	}

	// Get compass sensor from sensor manager
	@SuppressWarnings("deprecation")
	List<Sensor> list = this.sensorManager
		.getSensorList(Sensor.TYPE_ACCELEROMETER);

	// If found, then register as listener
	if (list != null && list.size() > 0) {
	    this.mSensor = list.get(0);
	    this.sensorManager.registerListener(this, this.mSensor,
		    SensorManager.SENSOR_DELAY_NORMAL);
	    this.lastAccessTime = System.currentTimeMillis();
	    this.setStatus(StepListener.STARTING);
	}

	// If error, then set status to error
	else {
	    this.setStatus(StepListener.ERROR_FAILED_TO_START);
	}

	return this.status;
    }

    public void stop() {
	if (this.status != StepListener.STOPPED) {
	    this.sensorManager.unregisterListener(this);
	}
	this.setStatus(StepListener.STOPPED);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
	// TODO Auto-generated method stub
    }

    @Override
    public void onSensorChanged(SensorEvent event) {

	this.setStatus(StepListener.RUNNING);

	float vSum = 0;
	for (int i = 0; i < 3; i++) {
	    final float v = mYOffset + event.values[i] * mScale[1];
	    vSum += v;
	}
	int k = 0;
	float v = vSum / 3;

	float direction = (v > mLastValues[k] ? 1 : (v < mLastValues[k] ? -1: 0));
	if (direction == -mLastDirections[k]) {
	    // Direction changed
	    int extType = (direction > 0 ? 0 : 1); // minumum or
	    // maximum?
	    mLastExtremes[extType][k] = mLastValues[k];
	    float diff = Math.abs(mLastExtremes[extType][k]
		    - mLastExtremes[1 - extType][k]);

	    if (diff > SENSITIVITY) {
		boolean isAlmostAsLargeAsPrevious = diff > (mLastDiff[k] * 2 / 3);
		boolean isPreviousLargeEnough = mLastDiff[k] > (diff / 3);
		boolean isNotContra = (mLastMatch != 1 - extType);

		if (isAlmostAsLargeAsPrevious && isPreviousLargeEnough&& isNotContra) {
		    end = System.currentTimeMillis();
		    if (end - start > 500) {// 此时判断为走了一步
			Log.i("StepDetector", "CURRENT_SETP:" + CURRENT_SETP);
			CURRENT_SETP++;
			mLastMatch = extType;
			start = end;
		    }
		} else {
		    mLastMatch = -1;
		}
	    }
	    mLastDiff[k] = diff;
	}
	mLastDirections[k] = direction;
	mLastValues[k] = v;

    }

    /**
     * Get status of compass sensor.
     *
     * @return status
     */
    public int getStatus() {
	return this.status;
    }

    /**
     * Set the status and send it to JavaScript.
     * 
     * @param status
     */
    private void setStatus(int status) {
	this.status = status;
    }

}