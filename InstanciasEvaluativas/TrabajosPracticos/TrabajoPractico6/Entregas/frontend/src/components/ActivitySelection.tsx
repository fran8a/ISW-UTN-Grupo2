import { Activity } from "@/types/registration";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { obtenerActividades } from "@/services/service";

interface ActivitySelectionProps {
  onSelectActivity: (activity: Activity) => void;
}

export const ActivitySelection = ({
  onSelectActivity,
}: ActivitySelectionProps) => {
  const [ACTIVITIES, setACTIVITIES] = useState<Activity[]>([]);
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await obtenerActividades();
        const normalized = response.map((a: any) => ({
          ...a,
          nombre: a.nombre?.trim(),
          requiere_talla: a.requiere_talla === 1,
        }));

        setACTIVITIES(normalized);
      } catch (error) {
        console.error("Error obteniendo actividades:", error);
      }
    };

    fetchActivities();
  }, []);

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
            className="p-6 cursor-pointer transition-all hover:shadow-[var(--shadow-card)] hover:border-primary/50 hover:scale-[1.02] flex flex-col justify-between min-h-[10rem]"
            onClick={() =>
              activity.total_cupos > 0 && onSelectActivity(activity)
            }
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-xl font-bold text-primary">
                {activity.nombre}
              </h4>
              {activity.requiere_talla == 1 && (
                <Badge variant="outline" className="text-xs">
                  Requiere talla
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground my-2 flex-grow">
              {activity.descripcion}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
