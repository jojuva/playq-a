/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package edu.uoc.jojuva.playqa;

import org.apache.cordova.Config;
import org.apache.cordova.CordovaActivity;

import android.os.Bundle;

import com.parse.Parse;
import com.parse.ParseAnalytics;
import com.parse.ParseInstallation;
import com.parse.PushService;

public class PlayQA extends CordovaActivity 
{
	private static final String TAG = "PlayQA";
	
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        //super.init();
        System.out.println("INICIANDO...");
        
        Parse.initialize(this, "2nYMgIyu9aOFd5cmsh0bOouDwXQKwiY05tDyYcFq", "qmkQFDtPf11ZATrrR79rWebOPDTMZ50rjLHfJl0B");
        PushService.setDefaultPushCallback(this, PlayQA.class);
        ParseInstallation.getCurrentInstallation().saveInBackground();
        ParseAnalytics.trackAppOpened(getIntent());

//    	Bundle extras = getIntent().getExtras();
    	String params = "";
//    	if (extras.getString("com.parse.Data") != null) {
//    	    JSONObject json;
//			try {
//				json = new JSONObject(extras.getString("com.parse.Data"));
//				String opp = json.getString("objectId");
//	    	    params = "?opp=" + opp;
//	    	    Log.i(TAG, "BUNDLE: " + extras.toString());
//			} catch (JSONException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//    	}
    	
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl() + params, 1000000);
        //super.loadUrl("file:///android_asset/www/index.html");
    }
}

