import { useState, useEffect } from "react";
import { Activity } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Clock, ArrowLeft, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DateTimeSelectionProps {
  activity: Activity;
  onSelect: (date: Date | undefined, time: string, availableSlots: number) => void;
  onBack: () => void;
  // optional controlled/initial values so parent can persist state
  selectedDate?: Date | undefined;
  selectedTime?: string;
  selectedSlots?: number;
  onChange?: (date: Date | undefined, time: string, availableSlots: number) => void;
}

export const DateTimeSelection = ({
  activity,
  onSelect,
  onBack,
  selectedDate: initialDate,
  selectedTime: initialTime,
  selectedSlots: initialSlots,
  onChange,
}: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || "");
  const [selectedSlots, setSelectedSlots] = useState<number>(initialSlots || 0);

  // keep local state in sync with parent when props change
  useEffect(() => {
    setSelectedDate(initialDate);
  }, [initialDate]);
  useEffect(() => {
    setSelectedTime(initialTime || "");
  }, [initialTime]);
  useEffect(() => {
    setSelectedSlots(initialSlots || 0);
  }, [initialSlots]);

  const handleTimeSelect = (time: string, availableSlots: number) => {
    setSelectedTime(time);
    setSelectedSlots(availableSlots);
    if (onChange) onChange(selectedDate, time, availableSlots);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      // inform parent of final selection and advance
      if (onChange) onChange(selectedDate, selectedTime, selectedSlots);
      onSelect(selectedDate, selectedTime, selectedSlots);
    }
  };

  const isMonday = (date: Date) => {
    return date.getDay() === 1;
  };

  const disabledDays = (date: Date) => {
    return date < new Date() || isMonday(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-primary">
            Selecciona fecha y horario
          </h3>
          <p className="text-sm text-muted-foreground">
            Actividad: <span className="font-medium text-foreground">{activity.name}</span>
          </p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          El parque permanece cerrado todos los <strong>lunes</strong>.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
            <CalendarIcon className="w-4 h-4" />
            Fecha
          </label>
          <Card className="p-4 inline-block">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDays}
              locale={es}
              className={cn("pointer-events-auto")}
              modifiers={{
                monday: (date) => isMonday(date)
              }}
              modifiersClassNames={{
                monday: "line-through opacity-50"
              }}
            />
          </Card>
        </div>

        {selectedDate && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <Clock className="w-4 h-4" />
              Horario
            </label>
            <p className="text-sm text-muted-foreground mb-3">
              Fecha seleccionada: {format(selectedDate, "PPPP", { locale: es })}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {activity.availableTimes.map((timeSlot) => (
                <Button
                  key={timeSlot.time}
                  variant={selectedTime === timeSlot.time ? "default" : "outline"}
                  className="h-auto py-4"
                  onClick={() => handleTimeSelect(timeSlot.time, timeSlot.availableSlots)}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold">{timeSlot.time}</span>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {timeSlot.availableSlots} cupos
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          size="lg"
          className="min-w-[200px]"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
