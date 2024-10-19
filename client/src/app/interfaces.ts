export interface User {
    email:string;
    id:string;
    picture:string;
}

export interface UserResponse{
    message:string;
    user:User
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
  bookings: MeetingResponse[];
}
export interface EventsResponse extends Events{
    id:string
}

export interface Meeting{
  eventId?: string;
  userId: string;
  name: string;
  email: string;
  additionalInfo: string;
  startTime: Date;
  endTime: Date;
}


export interface MeetingResponse extends Meeting {
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
