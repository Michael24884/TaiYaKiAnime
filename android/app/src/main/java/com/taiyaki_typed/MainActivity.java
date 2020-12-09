package com.taiyaki_typed;

import com.facebook.react.ReactActivity;
import android.content.Intent;
import android.content.res.Configuration; 
import com.google.android.gms.cast.framework.CastContext;


public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Taiyaki_Typed";
  }
  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    CastContext.getSharedInstance(this);
  }

   @Override
      public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }
}
