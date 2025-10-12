import { useState } from "react";
import { Activity, Participant } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParticipantsFormProps {
  activity: Activity;
  availableSlots: number;
  onSubmit: (participants: Participant[]) => void;
  onBack: () => void;
  // optional controlled values
  initialParticipants?: Participant[];
  onChange?: (participants: Participant[]) => void;
}

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const ParticipantsForm = ({
  activity,
  availableSlots,
  onSubmit,
  onBack,
  initialParticipants,
  onChange,
}: ParticipantsFormProps) => {
  const { toast } = useToast();
  const [numberOfParticipants, setNumberOfParticipants] = useState<number>(
    initialParticipants?.length || 1
  );
  const [participants, setParticipants] = useState<Participant[]>(
    initialParticipants && initialParticipants.length > 0
      ? initialParticipants
      : [{ name: "", dni: "", age: 0, clothingSize: "" }]
  );
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );

  const handleNumberChange = (value: string) => {
    const num = parseInt(value);
    if (num > 0 && num <= availableSlots) {
      setNumberOfParticipants(num);
      const newParticipants = Array.from(
        { length: num },
        (_, i) =>
          participants[i] || { name: "", dni: "", age: 0, clothingSize: "" }
      );
      setParticipants(newParticipants);
      if (onChange) onChange(newParticipants);
    }
  };

  const updateParticipant = (
    index: number,
    field: keyof Participant,
    value: string | number
  ) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
    if (onChange) onChange(updated);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      const updated = participants.filter((_, i) => i !== index);
      setParticipants(updated);
      setNumberOfParticipants(updated.length);
      if (onChange) onChange(updated);
    }
  };

  const addParticipant = () => {
    if (participants.length < availableSlots) {
      setParticipants([
        ...participants,
        { name: "", dni: "", age: 0, clothingSize: "" },
      ]);
      setNumberOfParticipants(participants.length + 1);
      if (onChange)
        onChange([
          ...participants,
          { name: "", dni: "", age: 0, clothingSize: "" },
        ] as Participant[]);
    }
  };

  const handleSubmit = () => {
    // Validation
    const hasEmptyFields = participants.some(
      (p) =>
        !p.name ||
        !p.dni ||
        p.age === 0 ||
        (activity.requiere_talla && !p.clothingSize)
    );

    if (hasEmptyFields) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los datos de los participantes",
        variant: "destructive",
      });
      return;
    }

    const hasErrorFields = Object.values(errors).some((participantErrors) =>
      Object.values(participantErrors).some((error) => error !== "")
    );

    if (hasErrorFields) {
      toast({
        title: "Errores en los campos",
        description:
          "Por favor corrige los errores en los datos de los participantes",
        variant: "destructive",
      });
      return;
    }

    onSubmit(participants);
  };

  const validateName = (value: string) => {
    if (!value.trim()) return "El nombre es obligatorio";
    if (value.trim().length < 3) return "Debe tener al menos 3 caracteres";
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value.trim()))
      return "Solo se permiten letras y espacios";
    return "";
  };

  const validateDni = (value: string) => {
    if (!value.trim()) return "El DNI es obligatorio";
    if (!/^\d{7,10}$/.test(value.trim()))
      return "Debe contener entre 7 y 10 dígitos numéricos";
    return "";
  };

const validateAge = (value: number) => {
  if (!value || isNaN(value)) return "La edad es obligatoria";

  const activityName = activity.nombre.toLowerCase();
  if (["palestra", "tirolesa"].includes(activityName)) {
    if (value < 8 || value > 99)
      return `La edad permitida para ${activityName} es entre 8 y 99 años`;
  } else if (["safari", "jardinería"].includes(activityName)) {
    if (value < 1 || value > 120)
      return `La edad permitida para ${activityName} es entre 1 y 120 años`;
  } 
  return "";
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
            Actividad:{" "}
            <span className="font-medium text-foreground">
              {activity.nombre}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="numParticipants" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Número de participantes
          </Label>
          <Select
            value={numberOfParticipants.toString()}
            onValueChange={handleNumberChange}
          >
            <SelectTrigger id="numParticipants" className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: Math.min(availableSlots, 10) },
                (_, i) => i + 1
              ).map((num) => (
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
                    onChange={(e) =>
                      updateParticipant(index, "name", e.target.value)
                    }
                    onBlur={(e) => {
                      const error = validateName(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        [index]: {
                          ...(prev[index] || {}),
                          name: error,
                        },
                      }));
                    }}
                    placeholder="Ej: Juan Pérez"
                    className={errors[index]?.name ? "border-destructive" : ""}
                  />
                  {errors[index]?.name && (
                    <p className="text-destructive text-sm">
                      {errors[index].name}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`dni-${index}`}>DNI *</Label>
                  <Input
                    id={`dni-${index}`}
                    value={participant.dni}
                    onChange={(e) =>
                      updateParticipant(index, "dni", e.target.value)
                    }
                    onBlur={(e) => {
                      const error = validateDni(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        [index]: {
                          ...(prev[index] || {}),
                          dni: error,
                        },
                      }));
                    }}
                    placeholder="Ej: 12345678"
                    className={errors[index]?.dni ? "border-destructive" : ""}
                  />
                  {errors[index]?.dni && (
                    <p className="text-destructive text-sm">
                      {errors[index].dni}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`age-${index}`}>Edad *</Label>
                  <Input
                    id={`age-${index}`}
                    type="number"
                    value={participant.age || ""}
                    onChange={(e) =>
                      updateParticipant(
                        index,
                        "age",
                        parseInt(e.target.value) || 0
                      )
                    }
                    onBlur={(e) => {
                      const error = validateAge(parseInt(e.target.value));
                      setErrors((prev) => ({
                        ...prev,
                        [index]: {
                          ...(prev[index] || {}),
                          age: error,
                        },
                      }));
                    }}
                    placeholder="Ej: 25"
                    min="1"
                    max="120"
                    className={errors[index]?.age ? "border-destructive" : ""}
                  />
                  {errors[index]?.age && (
                    <p className="text-destructive text-sm">
                      {errors[index].age}
                    </p>
                  )}
                </div>

                {activity.requiere_talla && (
                  <div className="space-y-2">
                    <Label htmlFor={`size-${index}`}>
                      Talla de vestimenta *
                    </Label>
                    <Select
                      value={participant.clothingSize}
                      onValueChange={(value) =>
                        updateParticipant(index, "clothingSize", value)
                      }
                    >
                      <SelectTrigger id={`size-${index}`}>
                        <SelectValue placeholder="Selecciona talla" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLOTHING_SIZES.map((size) => (
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
          <Button variant="outline" className="w-full" onClick={addParticipant}>
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
