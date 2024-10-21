export interface User {
  email: string;
  id: string;
  picture: string;
}

export interface UserResponse {
  message: string;
  user: User;
}

// Interface for the schedule data model
export interface AvailabilityPostInterface {
  startTime: string;
  endTime: string;
  day: string;
}

export interface Availability {
  email: string;
  id: string;
  days: AvailabilityPostInterface[];
}

export interface AvailabilityModel extends AvailabilityPostInterface {
  available: boolean;
}

export interface Events {
  title: string;
  description: string;
  duration: number;
  email: string;
  isPrivate: boolean;
  bookings: Meeting[];
}
export interface EventsResponse extends Events {
  id: string;
}

export interface Meeting {
  id?: string;
  eventId?: string;
  name: string;
  email: string;
  additionalInfo: string;
  startTime: Date;
  endTime: Date;
  slot: string[];
  attendees: string[];
  meetLink: string;
  googleEventId: string;
}

// Interface for TimeSlots
export interface TimeSlots {
  time: string;
  isSelected: boolean;
  canSelect: boolean;
  isBooked: boolean;
}

export interface EventDetails {
  eventId?: string;
  summary: string; // Title of the event
  description?: string; // Description of the event (optional)
  startTime: string; // Event start time in ISO format (e.g., '2024-10-21T10:00:00Z')
  endTime: string; // Event end time in ISO format (e.g., '2024-10-21T11:00:00Z')
  email: { email: string }[]; // List of attendee email addresses
  id?: string;
  startDate: Date;
  endDate: Date;
  slot: string[];
}

export interface Dashboard {
  name: string;
  email: string;
  picture: string;
  bookings: number;
  events: number;
}
