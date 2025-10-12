export interface TimeSlot {
  time: string;
  availableSlots: number;
}

export interface Activity {
  id: string;
  nombre: string;
  requiere_talla: number;
  total_cupos: number;
  total_horarios: number;
  // optional mocked terms for the activity (frontend-only)
  terms?: string[];
  // optional mocked description for UI
  description?: string;
}

export interface ActivitiesDetailResponse {
  actividad: ActivityDetail;
  horarios: Horario[];
}
export interface ActivityDetail {
  id: string;
  nombre: string;
  requiere_talla: number;
}

export interface Horario {
  id: string;
  hora: string;
  cupos: number;
  fecha: string;
}

export interface Participant {
  name: string;
  dni: string;
  age: number;
  clothingSize?: string;
}
