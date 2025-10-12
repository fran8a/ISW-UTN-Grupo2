import { ActivitiesDetailResponse, Activity } from "../types/registration";

// SOLO USADO EN EL MOCK
const mockTerms = (name: string) => [
  `La participación en "${name}" implica el cumplimiento de las normas del parque.`,
  "Se recomienda llevar vestimenta y calzado cómodos apropiados para la actividad.",
  "Los organizadores no se responsabilizan por objetos perdidos o daños personales menores.",
  "En caso de condiciones climáticas adversas, la actividad podrá ser reprogramada o cancelada.",
  "Al aceptar, autorizas el uso de imágenes en material promocional del parque.",
];

export const obtenerActividades = async (): Promise<Activity[]> => {
  const response = await fetch("/api/actividades").then((res) => res.json());

  // AGREGADO DEL MOCK
  return response.actividades.map((a: Activity) => ({
    ...a,
    terms: mockTerms(a.nombre),
    // DESCRIPCION MOCK
    description: `Disfruta de la actividad ${a.nombre} en EcoHarmony Park. Duración aproximada 1 hora.`,
  }));
};

export const obtenerDetalleActividad = async (
  id: string
): Promise<ActivitiesDetailResponse> => {
  const response = await fetch(`/api/actividad/${id}`).then((res) =>
    res.json()
  );

  // AGREGADO DEL MOCK
  const actividad: Activity = {
    ...response.actividad,
    terms: mockTerms(response.actividad.nombre),
  };
  // FIN AGREGADO DEL MOCK

  return {
    ...response,
    actividad,
  };
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
