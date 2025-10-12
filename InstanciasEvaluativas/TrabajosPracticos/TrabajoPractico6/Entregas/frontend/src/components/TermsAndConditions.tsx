import { useState, useEffect } from "react";
import { Activity } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TermsAndConditionsProps {
  activity: Activity;
  onAccept: (accepted: boolean) => void;
  onBack: () => void;
  initialAccepted?: boolean;
  onChange?: (accepted: boolean) => void;
}

export const TermsAndConditions = ({
  activity,
  onAccept,
  onBack,
  initialAccepted,
  onChange,
}: TermsAndConditionsProps) => {
  const { toast } = useToast();
  const [accepted, setAccepted] = useState<boolean>(initialAccepted || false);

  useEffect(() => {
    console.log("Initial accepted state:", activity);
    setAccepted(initialAccepted || false);
  }, [initialAccepted]);

  const handleContinue = () => {
    if (!accepted) {
      toast({
        title: "Términos y condiciones",
        description: "Debes aceptar los términos y condiciones para continuar",
        variant: "destructive",
      });
      return;
    }
    onAccept(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-primary">
            Términos y condiciones
          </h3>
          <p className="text-sm text-muted-foreground">
            Actividad:{" "}
            <span className="font-medium text-foreground">
              {activity.nombre}
            </span>
          </p>
        </div>
      </div>

      <Card className="p-4 md:p-6 bg-muted/30">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-primary">
            Términos y condiciones de {activity.nombre}
          </h4>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          <p className="text-sm text-muted-foreground mb-4">
            Por favor lee cuidadosamente los siguientes términos y condiciones
            antes de participar en esta actividad:
          </p>

          <ul className="space-y-3">
            {activity.terminos_y_condiciones
              .split(".")
              .filter((term) => term.trim() !== "")
              .map((term, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-primary font-semibold flex-shrink-0">
                    •
                  </span>
                  <span className="text-foreground">{term.trim()}.</span>
                </li>
              ))}
          </ul>

          <div className="mt-6 p-4 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Nota importante:</strong> Al
              aceptar estos términos, reconoces que has leído, comprendido y
              aceptas cumplir con todas las condiciones establecidas para la
              actividad de {activity.nombre}. EcoHarmony Park se reserva el
              derecho de negar la participación a cualquier persona que no
              cumpla con los requisitos o que ponga en riesgo su seguridad o la
              de otros participantes.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex items-center space-x-2 p-4 border border-border rounded-lg bg-card">
        <Checkbox
          id="terms"
          checked={accepted}
          onCheckedChange={(checked) => {
            const val = checked as boolean;
            setAccepted(val);
            if (onChange) onChange(val);
          }}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          He leído y acepto los términos y condiciones de la actividad{" "}
          {activity.nombre}
        </label>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleContinue}
          disabled={!accepted}
          size="lg"
          className="min-w-[200px]"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
