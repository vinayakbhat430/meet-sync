import { Injectable } from '@angular/core';

declare var gapi: any;
declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private CLIENT_ID = '1066819936026-joc8gl1liv8n348g92i782cv9dphp87c.apps.googleusercontent.com';
  private API_KEY = 'AIzaSyCOT0ivPQRLrCpimfLSbluU-aAobsssGYE';
  private DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  private SCOPES = 'https://www.googleapis.com/auth/calendar';
  private tokenClient: any;
  private gapiInited = false;
  private gisInited = false;
  private accessToken: string | null = null;

  constructor() {}

  /**
   * Initialize GAPI client
   */
  public initializeGapiClient() {
    return new Promise<void>((resolve, reject) => {
      gapi.load('client', async () => {
        try {
          await gapi.client.init({
            apiKey: this.API_KEY,
            discoveryDocs: [this.DISCOVERY_DOC],
          });
          this.gapiInited = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * Initialize GIS client
   */
  public initializeGisClient() {
    return new Promise<void>((resolve, reject) => {
      try {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: this.CLIENT_ID,
          scope: this.SCOPES,
          callback: (tokenResponse: any) => {
            this.accessToken = tokenResponse.access_token;
            console.log(this.accessToken)
            // Store token locally
            if(this.accessToken){
              localStorage.setItem('gapi_access_token', this.accessToken);
            }
          },
        });
        this.gisInited = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Perform login and request consent once
   */
  public async loginWithGoogle() {
    // Ensure GAPI client is initialized before login
    if (!this.gapiInited) {
      await this.initializeGapiClient(); // Ensure GAPI is initialized
    }
  
    // Ensure GIS client is initialized before login
    if (!this.gisInited) {
      await this.initializeGisClient(); // Ensure GIS is initialized
    }
  
    return new Promise<void>((resolve, reject) => {
      if (!this.tokenClient) {
        reject('Google OAuth client is not initialized');
        return;
      }
  
      this.tokenClient.callback = async (response: any) => {
        if (response.error !== undefined) {
          reject(response);
          return;
        }
        console.log("Response", response)
  
        this.accessToken = response.access_token;
        if(this.accessToken){
          localStorage.setItem('google_access_token', this.accessToken); // Store token
        }
        resolve();
      };
  
      // Check if gapi.client is defined before accessing getToken()
      if (!gapi.client || !gapi.client.getToken) {
        reject('GAPI client is not initialized');
        return;
      }
  
      if (!gapi.client.getToken()) {
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        this.tokenClient.requestAccessToken({ prompt: '' });
      }
    });
  }
  
  

  /**
   * Create a Google Calendar Event
   */
  public createGoogleEvent(eventDetails: any) {
    return new Promise<void>((resolve, reject) => {
      // Check if access token is available
      this.accessToken = localStorage.getItem('gapi_access_token');

      if (!this.accessToken) {
        reject('User is not logged in or consent not granted.');
        return;
      }

      // Set the access token for gapi
      gapi.client.setToken({ access_token: this.accessToken });

      this.scheduleEvent(eventDetails)
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }

  /**
   * Schedule a Google Calendar Event
   */
  private scheduleEvent(eventDetails: any) {
    return new Promise<void>((resolve, reject) => {
      const event = {
        summary: eventDetails.summary || 'Event Title',
        location: eventDetails.location || '800 Howard St., San Francisco, CA 94103',
        description: eventDetails.description || 'A chance to hear more about Google\'s developer products.',
        start: {
          dateTime: eventDetails.startTime,
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: eventDetails.endTime,
          timeZone: 'America/Los_Angeles',
        },
        recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
        attendees: [{ email: eventDetails.email }],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      request.execute((event: any) => {
        if (event.htmlLink) {
          console.log('Event created: ', event.htmlLink);
          resolve();
        } else {
          reject('Error creating event');
        }
      });
    });
  }
}
