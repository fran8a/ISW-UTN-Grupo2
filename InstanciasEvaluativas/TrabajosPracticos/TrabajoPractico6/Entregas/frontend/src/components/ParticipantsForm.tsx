import { useState } from "react";
import { Activity, Participant } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParticipantsFormProps {
  activity: Activity;
  availableSlots: number;
  onSubmit: (participants: Participant[]) => void;
  onBack: () => void;
}

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const ParticipantsForm = ({ activity, availableSlots, onSubmit, onBack }: ParticipantsFormProps) => {
  const { toast } = useToast();
  const [numberOfParticipants, setNumberOfParticipants] = useState<number>(1);
  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", dni: "", age: 0, clothingSize: "" }
  ]);

  const handleNumberChange = (value: string) => {
    const num = parseInt(value);
    if (num > 0 && num <= availableSlots) {
      setNumberOfParticipants(num);
      const newParticipants = Array.from({ length: num }, (_, i) => 
        participants[i] || { name: "", dni: "", age: 0, clothingSize: "" }
      );
      setParticipants(newParticipants);
    }
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string | number) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      const updated = participants.filter((_, i) => i !== index);
      setParticipants(updated);
      setNumberOfParticipants(updated.length);
    }
  };

  const addParticipant = () => {
    if (participants.length < availableSlots) {
      setParticipants([...participants, { name: "", dni: "", age: 0, clothingSize: "" }]);
      setNumberOfParticipants(participants.length + 1);
    }
  };

  const handleSubmit = () => {
    // Validation
    const hasEmptyFields = participants.some(p => 
      !p.name || !p.dni || p.age === 0 || (activity.requiresClothingSize && !p.clothingSize)
    );

    if (hasEmptyFields) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los datos de los participantes",
        variant: "destructive"
      });
      return;
    }

    onSubmit(participants);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-primary">
            Datos de los participantes
          </h3>
          <p className="text-sm text-muted-foreground">
            Actividad: <span className="font-medium text-foreground">{activity.name}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="numParticipants" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Número de participantes
          </Label>
          <Select value={numberOfParticipants.toString()} onValueChange={handleNumberChange}>
            <SelectTrigger id="numParticipants" className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: Math.min(availableSlots, 10) }, (_, i) => i + 1).map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {participants.map((participant, index) => (
            <Card key={index} className="p-6 relative">
              {participants.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => removeParticipant(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}

              <h4 className="text-lg font-semibold text-primary mb-4">
                Participante {index + 1}
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Nombre completo *</Label>
                  <Input
                    id={`name-${index}`}
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, "name", e.target.value)}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`dni-${index}`}>DNI *</Label>
                  <Input
                    id={`dni-${index}`}
                    value={participant.dni}
                    onChange={(e) => updateParticipant(index, "dni", e.target.value)}
                    placeholder="Ej: 12345678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`age-${index}`}>Edad *</Label>
                  <Input
                    id={`age-${index}`}
                    type="number"
                    value={participant.age || ""}
                    onChange={(e) => updateParticipant(index, "age", parseInt(e.target.value) || 0)}
                    placeholder="Ej: 25"
                    min="1"
                    max="120"
                  />
                </div>

                {activity.requiresClothingSize && (
                  <div className="space-y-2">
                    <Label htmlFor={`size-${index}`}>Talla de vestimenta *</Label>
                    <Select
                      value={participant.clothingSize}
                      onValueChange={(value) => updateParticipant(index, "clothingSize", value)}
                    >
                      <SelectTrigger id={`size-${index}`}>
                        <SelectValue placeholder="Selecciona talla" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLOTHING_SIZES.map(size => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {participants.length < availableSlots && (
          <Button
            variant="outline"
            className="w-full"
            onClick={addParticipant}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar participante
          </Button>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSubmit} size="lg" className="min-w-[200px]">
          Continuar
        </Button>
      </div>
    </div>
  );
};
