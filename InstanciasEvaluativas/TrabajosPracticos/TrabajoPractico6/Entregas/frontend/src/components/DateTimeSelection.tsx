import { useState, useEffect } from "react";
import { Activity, Horario } from "@/types/registration";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  Clock,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { obtenerDetalleActividad } from "@/services/service";

interface DateTimeSelectionProps {
  activity: Activity;
  onSelect: (
    date: Date | undefined,
    time: string,
    availableSlots: number,
    horarioId?: number | string
  ) => void;
  onBack: () => void;
  // optional controlled/initial values so parent can persist state
  selectedDate?: Date | undefined;
  selectedTime?: string;
  selectedSlots?: number;
  currentMonth?: Date;
  onChange?: (
    date: Date | undefined,
    time: string,
    availableSlots: number,
    horarioId?: number | string
  ) => void;
  onMonthChange?: (month: Date) => void;
}

export const DateTimeSelection = ({
  activity,
  onSelect,
  onBack,
  selectedDate: initialDate,
  selectedTime: initialTime,
  selectedSlots: initialSlots,
  currentMonth: initialMonth,
  onChange,
  onMonthChange,
}: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate
  );
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || "");
  const [selectedSlots, setSelectedSlots] = useState<number>(initialSlots || 0);
  const [selectedHorarioId, setSelectedHorarioId] = useState<
    number | string | undefined
  >(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    initialMonth || new Date()
  );
  const [availableHorarios, setAvailableHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setSelectedDate(initialDate);
  }, [initialDate]);
  useEffect(() => {
    setSelectedTime(initialTime || "");
  }, [initialTime]);
  useEffect(() => {
    setSelectedSlots(initialSlots || 0);
  }, [initialSlots]);
  useEffect(() => {
    if (initialMonth) {
      setCurrentMonth(initialMonth);
    }
  }, [initialMonth]);

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
    if (onMonthChange) {
      onMonthChange(month);
    }
  };

  // Función para verificar si una hora ya pasó hoy
  const esHorarioPasado = (fecha: Date, hora: string): boolean => {
    const hoy = new Date();
    const fechaSeleccionada = new Date(fecha);
    
    // Normalizar las fechas para comparar solo día, mes y año
    hoy.setHours(0, 0, 0, 0);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    
    // Si la fecha seleccionada no es hoy, no filtrar
    if (fechaSeleccionada.getTime() !== hoy.getTime()) {
      return false;
    }
    
    // Es hoy, comparar la hora
    const ahora = new Date();
    const [horaStr, minutoStr] = hora.split(':');
    const horarioDate = new Date();
    horarioDate.setHours(parseInt(horaStr, 10), parseInt(minutoStr, 10), 0, 0);
    
    return horarioDate <= ahora;
  };

  // Función para obtener horarios para una fecha específica
  const obtenerHorariosParaFecha = async (fecha: Date) => {
    if (!activity.id) return;

    setLoading(true);
    setError("");
    setSelectedTime("");
    setSelectedSlots(0);

    try {
      const detalle = await obtenerDetalleActividad(activity.id);
      const fechaStr = format(fecha, "yyyy-MM-dd");

      // Filtrar horarios para la fecha seleccionada
      let horariosParaFecha = detalle.horarios.filter(
        (horario) => horario.fecha === fechaStr
      );

      // Si la fecha es hoy, filtrar horarios pasados
      horariosParaFecha = horariosParaFecha.filter(
        (horario) => !esHorarioPasado(fecha, horario.hora)
      );

      setAvailableHorarios(horariosParaFecha);

      if (horariosParaFecha.length === 0) {
        setError("No hay horarios disponibles para la fecha seleccionada");
      }
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      setError("Error al cargar los horarios disponibles");
      setAvailableHorarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      obtenerHorariosParaFecha(selectedDate);
    } else {
      setAvailableHorarios([]);
      setSelectedTime("");
      setSelectedSlots(0);
    }
  }, [selectedDate, activity.id]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedHorarioId(undefined);
    if (onChange && date) {
      onChange(date, "", 0, undefined); // Reset time and slots when date changes
    }
  };

  const handleTimeSelect = (
    time: string,
    availableSlots: number,
    horarioId?: number | string
  ) => {
    setSelectedTime(time);
    setSelectedSlots(availableSlots);
    setSelectedHorarioId(horarioId);
    if (onChange) onChange(selectedDate, time, availableSlots, horarioId);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      // inform parent of final selection and advance
      if (onChange)
        onChange(selectedDate, selectedTime, selectedSlots, selectedHorarioId);
      onSelect(selectedDate, selectedTime, selectedSlots, selectedHorarioId);
    }
  };

  const isMonday = (date: Date) => {
    return date.getDay() === 1;
  };

  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    return date < today || isMonday(date);
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
            Actividad:{" "}
            <span className="font-medium text-foreground">
              {activity.nombre}
            </span>
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
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={handleMonthChange}
              disabled={disabledDays}
              locale={es}
              className={cn("pointer-events-auto")}
              modifiers={{
                monday: (date) => isMonday(date),
              }}
              modifiersClassNames={{
                monday: "line-through opacity-50",
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

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Cargando horarios disponibles...</span>
              </div>
            ) : error ? (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : availableHorarios.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableHorarios.map((horario) => (
                  <Button
                    key={horario.id}
                    variant={
                      selectedTime === horario.hora ? "default" : "outline"
                    }
                    className="h-auto py-4"
                    onClick={() =>
                      handleTimeSelect(horario.hora, horario.cupos, horario.id)
                    }
                    disabled={horario.cupos === 0}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">{horario.hora}</span>
                      <Badge
                        variant={
                          horario.cupos === 0 ? "destructive" : "secondary"
                        }
                        className="mt-1 text-xs"
                      >
                        {horario.cupos === 0
                          ? "Sin cupos"
                          : `${horario.cupos} cupos`}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No hay horarios disponibles para esta fecha.
                </AlertDescription>
              </Alert>
            )}
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
