import { inject, Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { EventDetails } from '../interfaces';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin } from 'rxjs';

declare var gapi: any;
declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly CLIENT_ID =
    '1066819936026-joc8gl1liv8n348g92i782cv9dphp87c.apps.googleusercontent.com';
  private readonly API_KEY = 'AIzaSyCOT0ivPQRLrCpimfLSbluU-aAobsssGYE';
  private readonly DISCOVERY_DOC =
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  private readonly SCOPES = 'https://www.googleapis.com/auth/calendar';

  private tokenClient: any;
  private gapiInited = false;
  private gisInited = false;
  private accessToken: string | null = null;

  private apiService = inject(ApiServiceService);
  private messageService = inject(NzMessageService);

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
          reject('GAPI initialization failed');
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
            if (tokenResponse.error) {
              reject('Token request failed');
              return;
            }
            this.accessToken = tokenResponse.access_token;
            sessionStorage.setItem('gapi_access_token', this.accessToken || '');
          },
        });
        this.gisInited = true;
        resolve();
      } catch (error) {
        reject('GIS initialization failed');
      }
    });
  }

  /**
   * Perform login and request consent once
   */
  public async loginWithGoogle() {
    try {
      if (!this.gapiInited) await this.initializeGapiClient();
      if (!this.gisInited) await this.initializeGisClient();

      return new Promise<void>((resolve, reject) => {
        this.tokenClient.callback = (response: any) => {
          if (response.error) {
            reject(response.error);
            return;
          }
          this.accessToken = response.access_token;
          sessionStorage.setItem('google_access_token', this.accessToken || '');
          resolve();
        };

        const token = gapi.client.getToken();
        if (!token) {
          this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
          this.tokenClient.requestAccessToken({ prompt: '' });
        }
      });
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  /**
   * Create a Google Calendar Event
   */
  public createGoogleEvent(eventDetails: EventDetails) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (!sessionStorage.getItem('google_access_token')) {
          await this.loginWithGoogle();
        }

        this.accessToken = sessionStorage.getItem('google_access_token');

        gapi.client.setToken({ access_token: this.accessToken });
        this.scheduleEvent(eventDetails)
          .then((d) => resolve(d))
          .catch((error) => {
            this.messageService.error('Unable to create event');
            reject(error);
          });
      } catch (error) {
        reject('Failed to create event');
      }
    });
  }

  /**
   * Schedule a Google Calendar Event
   */
  private scheduleEvent(eventDetails: EventDetails) {
    return new Promise<any>((resolve, reject) => {
      const event = {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.startTime,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: eventDetails.endTime,
          timeZone: 'Asia/Kolkata',
        },
        attendees: eventDetails.email,
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
        sendNotifications: true,
      });

      request.execute((event: any) => {
        if (event.htmlLink) {
          this.saveEventToBackend(eventDetails, event.htmlLink, event.id)
              this.messageService.success('Event created successfully!');
              resolve(event);
        } else {
          reject('Error creating event');
        }
      });
    });
  }

/**
 * Save event to backend
 */
private saveEventToBackend(
  eventDetails: EventDetails,
  htmlLink: string,
  googleEventId: string,
) {
  const postMeetingObservables = eventDetails.email.map((email) =>
    this.apiService.postMeeting({
      eventId: eventDetails.id || '',
      name: eventDetails.summary,
      email: email.email,
      additionalInfo: eventDetails.description || '',
      startTime: eventDetails.startDate,
      endTime: eventDetails.endDate,
      slot: eventDetails.slot,
      attendees: eventDetails.email.map((d) => d.email),
      meetLink: htmlLink,
      googleEventId: googleEventId,
    })
  );

  // Wait for all postMeeting API calls to complete using forkJoin
  forkJoin(postMeetingObservables).subscribe({
    next: (responses) => {
    },
    error: (error) => {
      console.error('Failed to save some meetings:', error);
    }
  });
}


  /**
   * Update a Google Calendar Event
   */
  public updateGoogleEvent(googleEventId: string, updatedEventDetails: EventDetails) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (!this.gapiInited) await this.initializeGapiClient();
        if (!this.gisInited) await this.initializeGisClient();
        if (!sessionStorage.getItem('google_access_token')) {
          await this.loginWithGoogle();
        }

        this.accessToken = sessionStorage.getItem('google_access_token');


        gapi.client.setToken({ access_token: this.accessToken });
        
        const event = {
          summary: updatedEventDetails.summary,
          description: updatedEventDetails.description,
          start: {
            dateTime: updatedEventDetails.startTime,
            timeZone: 'Asia/Kolkata',
          },
          end: {
            dateTime: updatedEventDetails.endTime,
            timeZone: 'Asia/Kolkata',
          },
          attendees: updatedEventDetails.email,
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 10 },
            ],
          },
        };

        const request = gapi.client.calendar.events.update({
          calendarId: 'primary',
          eventId: googleEventId,
          resource: event,
          sendNotifications: true,
        });
        console.log("Executing Event")

        request.execute((event: any) => {
          if (event.htmlLink) {
            this.savePatchToBackend(updatedEventDetails,event.htmlLink,event.id)
            this.messageService.success('Event updated successfully!');
            resolve();
          } else {
            reject('Error updating event');
          }
        });
      } catch (error) {
        console.log(error)
        reject('Failed to update event');
      }
    });
  }

  /**
 * Save event to backend
 */
private savePatchToBackend(
  eventDetails: EventDetails,
  htmlLink: string,
  googleEventId: string,
) {
  const postMeetingObservables = eventDetails.email.map((email) =>
    this.apiService.patchMeeting(eventDetails.id || '',{
      eventId: eventDetails.id || '',
      name: eventDetails.summary,
      email: email.email,
      additionalInfo: eventDetails.description || '',
      startTime: eventDetails.startDate,
      endTime: eventDetails.endDate,
      slot: eventDetails.slot,
      attendees: eventDetails.email.map((d) => d.email),
      meetLink: htmlLink,
      googleEventId: googleEventId,
    })
  );

  // Wait for all postMeeting API calls to complete using forkJoin
  forkJoin(postMeetingObservables).subscribe({
    next: (responses) => {
    },
    error: (error) => {
      console.error('Failed to save some meetings:', error);
    }
  });
}

  /**
   * Delete a Google Calendar Event
   */
  public deleteEvent(googleEventId: string) {
    return new Promise<void>(async (resolve, reject) => {
      try{
        if (!this.gapiInited) await this.initializeGapiClient();
        if (!this.gisInited) await this.initializeGisClient();
        if (!sessionStorage.getItem('google_access_token')) {
          await this.loginWithGoogle();
        }
        this.accessToken = sessionStorage.getItem('google_access_token');

        gapi.client.setToken({ access_token: this.accessToken });

        const request = gapi.client.calendar.events.delete({
          calendarId: 'primary',
          eventId: googleEventId,
          sendNotifications: true,
        });
  
        request.execute((response: any) => {
          if (!response || response.error) {
            reject('Error deleting event');
          } else {
            this.messageService.info('Meeting cancelled successfully');
            resolve();
          }
        });
      }catch (error) {
        this.messageService.error('Meeting cancel failed');
        reject('Failed to delete event');
      }
    });
  }
}
