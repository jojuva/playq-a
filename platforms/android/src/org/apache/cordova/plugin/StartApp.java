package org.apache.cordova.plugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.net.Uri;


public class StartApp extends CordovaPlugin
{

	public boolean execute(String action, JSONArray data, CallbackContext callbackContext)
    {
        try {
            if (action.equals("startApp")) {
                if (data.length() != 1) {
                	callbackContext.error("");
                	return false;
                }
                JSONObject obj = data.getJSONObject(0);
                String component = obj.getString("android");
                startActivity(component, callbackContext);
                return true;
            }
            callbackContext.error("");
            return false;
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error("");
            return false;
        }
    }

 
    void startActivity(String component, CallbackContext callbackContext) {
       /* Intent intent = new Intent("android.intent.action.MAIN");
        intent.addCategory("android.intent.category.LAUNCHER");
        intent.setComponent(ComponentName.unflattenFromString(component));*/
    	Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(component));
    	intent.setClassName("com.google.android.apps.maps", "com.google.android.maps.MapsActivity");
        cordova.getActivity().startActivity(intent);
    }
}
