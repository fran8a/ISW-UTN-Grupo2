import { Activity, Participant } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Users, 
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegistrationSummaryProps {
  activity: Activity;
  date: Date | undefined;
  time: string;
  participants: Participant[];
  onBack: () => void;
  onReset: () => void;
}

export const RegistrationSummary = ({ 
  activity, 
  date, 
  time, 
  participants,
  onBack,
  onReset
}: RegistrationSummaryProps) => {
  const { toast } = useToast();

  const handleConfirm = () => {
    toast({
      title: "¡Inscripción exitosa!",
      description: `Te has inscrito correctamente a ${activity.name}. Recibirás un correo de confirmación.`,
    });
    
    // Volver al menú principal después de un breve delay
    setTimeout(() => {
      onReset();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-primary">
            Resumen de inscripción
          </h3>
          <p className="text-sm text-muted-foreground">
            Verifica los datos antes de confirmar
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-lg border-2 border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-6 h-6 text-primary" />
          <h4 className="text-2xl font-bold text-primary">{activity.name}</h4>
        </div>
        <p className="text-muted-foreground">{activity.description}</p>
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-semibold text-primary mb-4">
          Detalles de la reserva
        </h4>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-semibold">
                {date ? format(date, "PPPP", { locale: es }) : "No seleccionada"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Horario</p>
              <p className="font-semibold">{time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Participantes</p>
              <p className="font-semibold">{participants.length} persona{participants.length > 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-lg font-semibold text-primary mb-4">
          Participantes registrados
        </h4>

        <div className="space-y-4">
          {participants.map((participant, index) => (
            <div key={index}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-foreground">
                    Participante {index + 1}
                  </h5>
                  <Badge variant="secondary">
                    {participant.age} años
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nombre:</span>
                    <p className="font-medium">{participant.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">DNI:</span>
                    <p className="font-medium">{participant.dni}</p>
                  </div>
                  {participant.clothingSize && (
                    <div>
                      <span className="text-muted-foreground">Talla:</span>
                      <p className="font-medium">{participant.clothingSize}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button 
          onClick={handleConfirm} 
          size="lg" 
          className="w-full"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Confirmar inscripción
        </Button>
      </div>
    </div>
  );
};
