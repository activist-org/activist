export interface ContextCreateEventData {
  [CreateEventSteps.EventDetails]:{
    tagline: string;
    name: string;
    description: string;
  };
  [CreateEventSteps.EventTypeAndRoles]:{
    type: EventType;
    roles:string;
  };
  [CreateEventSteps.LocationAndTime]:{
    location: string;
    dates: {
    startDate: string;
    endDate: string;
    };
    createAnother: boolean;
  };
}
