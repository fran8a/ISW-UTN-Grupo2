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
