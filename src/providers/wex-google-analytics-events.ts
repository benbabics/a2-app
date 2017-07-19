import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Value } from '../decorators/value';
import { Injectable } from '@angular/core';

@Injectable()
export class WexGoogleAnalyticsEvents extends GoogleAnalytics {
    @Value("GOOGLE_ANALYTICS.TRACKING_ID") TRACKING_ID: string;

    constructor() { 
        super();
        if (this.TRACKING_ID === "") {
            console.warn("No TRACKING_ID found for Google Analytics for this session.");
        } else {
            super.startTrackerWithId(this.TRACKING_ID);
        }
    }

     trackView(view: string): Promise<any> {
        if (this.TRACKING_ID !== "") {
            return super.trackView(view);
        } else {
            return null;
        }
     }

    
}