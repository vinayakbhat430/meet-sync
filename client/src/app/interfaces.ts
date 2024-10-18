// Interface for the schedule data model
export interface AvailabilityPostInterface{
    startTime: string;
    endTime: string;
    day: string;
}


export interface Availability {
    email:string;
    id:string;
    days: AvailabilityPostInterface[]
}
  

export interface AvailabilityModel extends AvailabilityPostInterface {
    available: boolean;
}

export interface Events {
    title:string;
    description:string;
    duration: number;
    userId:string;
    isPrivate:string;
    bookings:BookingsDoc[]
}

interface BookingsDoc {
    eventId?:string;
    userId:string;
    name: string;
    email:string;
    additionalInfo:string;
    startTime:Date;
    endTime:Date;
    meetLink:string;
    googleEventId:string;
}

