import { ActivitiesDetailResponse, Activity } from "../types/registration";

const baseURL = import.meta.env.DEV
  ? "/api" 
  : import.meta.env.VITE_BACKEND_URL; 

console.log("🌍 BaseURL usada por el front:", baseURL);

export const obtenerActividades = async (): Promise<Activity[]> => {
  const response = await fetch(`${baseURL}/actividades`);
  const data = await response.json();
  return data.actividades;
};

export const obtenerDetalleActividad = async (
  id: string
): Promise<ActivitiesDetailResponse> => {
  const response = await fetch(`${baseURL}/actividad/${id}`);
  return await response.json();
};

export const inscribirActividad = async (body: any) => {
  const response = await fetch(`${baseURL}/inscripcion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Error en la inscripción");
  }

  return response.json();
};
