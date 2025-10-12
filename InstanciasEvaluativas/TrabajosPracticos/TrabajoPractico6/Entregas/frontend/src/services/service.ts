import { ActivitiesDetailResponse, Activity } from "../types/registration";

export const obtenerActividades = async (): Promise<Activity[]> => {
  const response = await fetch("/api/actividades").then((res) => res.json());
  return response.actividades;
};

export const obtenerDetalleActividad = async (
  id: string
): Promise<ActivitiesDetailResponse> => {
  const response = await fetch(`/api/actividad/${id}`).then((res) =>
    res.json()
  );

  return response;
};

export const inscribirActividad = async (body: any) => {
  const response = await fetch(`/api/inscripcion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Error en la inscripción");
  }

  return response.json();
};
