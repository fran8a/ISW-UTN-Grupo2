export interface TimeSlot {
  time: string;
  availableSlots: number;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  requiresClothingSize: boolean;
  availableSlots: number;
  availableTimes: TimeSlot[];
  terms: string[];
}

export interface Participant {
  name: string;
  dni: string;
  age: number;
  clothingSize?: string;
}
