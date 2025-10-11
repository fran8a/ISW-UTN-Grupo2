import { Activity } from "@/types/registration";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users } from "lucide-react";

interface ActivitySelectionProps {
  onSelectActivity: (activity: Activity) => void;
}

const ACTIVITIES: Activity[] = [
  {
    id: "tirolesa",
    name: "Tirolesa",
    description:
      "Deslízate a través del dosel del bosque con vistas espectaculares",
    requiresClothingSize: true,
    availableSlots: 8,
    availableTimes: [
      { time: "09:00", availableSlots: 2 },
      { time: "11:00", availableSlots: 2 },
      { time: "14:00", availableSlots: 2 },
      { time: "16:00", availableSlots: 2 },
    ],
    terms: [
      "Peso máximo permitido: 120kg",
      "Uso obligatorio de equipo de seguridad proporcionado",
      "No está permitido si tienes problemas cardíacos o vértigo severo",
    ],
  },
  {
    id: "safari",
    name: "Safari",
    description:
      "Explora la fauna local en un recorrido guiado por expertos naturalistas",
    requiresClothingSize: false,
    availableSlots: 12,
    availableTimes: [
      { time: "08:00", availableSlots: 3 },
      { time: "10:00", availableSlots: 3 },
      { time: "15:00", availableSlots: 3 },
      { time: "17:00", availableSlots: 3 },
    ],
    terms: [
      "Mantener silencio durante el recorrido",
      "No alimentar a los animales",
      "Seguir las instrucciones del guía en todo momento",
      "Usar protector solar y repelente de insectos",
    ],
  },
  {
    id: "palestra",
    name: "Palestra",
    description: "Desafía tus límites en nuestro muro de escalada profesional",
    requiresClothingSize: true,
    availableSlots: 6,
    availableTimes: [
      { time: "10:00", availableSlots: 2 },
      { time: "12:00", availableSlots: 1 },
      { time: "15:00", availableSlots: 2 },
      { time: "17:00", availableSlots: 1 },
    ],
    terms: [
      "Uso obligatorio de arnés y casco",
      "Firma de descargo de responsabilidad requerida",
      "No escalar si has consumido alcohol",
    ],
  },
  {
    id: "jardineria",
    name: "Jardinería",
    description:
      "Aprende sobre plantas nativas y contribuye al cuidado del parque",
    requiresClothingSize: false,
    availableSlots: 15,
    availableTimes: [
      { time: "09:00", availableSlots: 4 },
      { time: "11:00", availableSlots: 4 },
      { time: "14:00", availableSlots: 4 },
      { time: "16:00", availableSlots: 3 },
    ],
    terms: [
      "Traer guantes de jardinería (opcional, se proporcionan)",
      "Usar ropa cómoda que pueda ensuciarse",
      "Informar sobre alergias a plantas",
      "Seguir las instrucciones del jardinero guía",
    ],
  },
];

export const ActivitySelection = ({
  onSelectActivity,
}: ActivitySelectionProps) => {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-primary mb-2">
          Selecciona una actividad
        </h3>
        <p className="text-muted-foreground">
          Elige la aventura que más te emocione
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ACTIVITIES.map((activity) => (
          <Card
            key={activity.id}
            className="p-6 cursor-pointer transition-all hover:shadow-[var(--shadow-card)] hover:border-primary/50 hover:scale-[1.02]"
            onClick={() =>
              activity.availableSlots > 0 && onSelectActivity(activity)
            }
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-xl font-bold text-primary">
                {activity.name}
              </h4>
              {activity.availableSlots > 0 ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {activity.availableSlots} cupos
                </Badge>
              ) : (
                <Badge variant="destructive">Lleno</Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              {activity.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {activity.requiresClothingSize && (
                <Badge variant="outline" className="text-xs">
                  Requiere talla
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {activity.availableTimes.length} horarios
              </Badge>
            </div>
            {activity.availableSlots > 0 && (
              <div className="mt-4 flex items-center text-primary text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Seleccionar
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
