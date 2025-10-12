import { useState } from "react";
import { ActivitySelection } from "@/components/ActivitySelection";
import { DateTimeSelection } from "@/components/DateTimeSelection";
import { ParticipantsForm } from "@/components/ParticipantsForm";
import { TermsAndConditions } from "@/components/TermsAndConditions";
import { RegistrationSummary } from "@/components/RegistrationSummary";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Participant } from "@/types/registration";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number>(0);
  const [selectedHorarioId, setSelectedHorarioId] = useState<
    number | string | undefined
  >(undefined);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivity(activity);
    setCurrentStep(2);
  };

  const handleDateTimeSelect = (
    date: Date | undefined,
    time: string,
    availableSlots: number,
    horarioId?: number | string
  ) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedTimeSlots(availableSlots);
    setSelectedHorarioId(horarioId);
    setCurrentStep(3);
  };

  const handleDateTimeChange = (
    date: Date | undefined,
    time: string,
    availableSlots: number,
    horarioId?: number | string
  ) => {
    // Persist intermediate changes when user selects time/date but hasn't continued
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedTimeSlots(availableSlots);
    setSelectedHorarioId(horarioId);
  };

  const handleMonthChange = (month: Date) => {
    setCalendarMonth(month);
  };

  const handleParticipantsSubmit = (participantsList: Participant[]) => {
    setParticipants(participantsList);
    setCurrentStep(4);
  };

  const handleParticipantsChange = (participantsList: Participant[]) => {
    setParticipants(participantsList);
  };

  const handleTermsAccept = (accepted: boolean) => {
    setTermsAccepted(accepted);
    if (accepted) {
      setCurrentStep(5);
    }
  };

  const handleTermsChange = (accepted: boolean) => {
    setTermsAccepted(accepted);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedActivity(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedTimeSlots(0);
    setCalendarMonth(new Date());
    setParticipants([]);
    setTermsAccepted(false);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen b bg-gradient-to-b from-white via-[#E8FCCF] to-[#C5ED9D]  py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-block mb-3 px-4 py-1 bg-[#C5ED9D]/60 rounded-full">
            <span className="md:text-sm text-xs font-medium text-[#3E8914] tracking-wide uppercase">
              🌱 Bienvenido a la naturaleza
            </span>
          </div>
          <h1 className="md:text-5xl text-4xl font-bold text-[#134611] tracking-tight">
            EcoHarmony <span className="text-[#3DA35D]">Park</span>
          </h1>
          {/* <p className="text-lg text-[#3E8914]/80 mt-2">
            Vive la aventura en armonía con la naturaleza
          </p> */}
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-[#3E8914] to-[#96E072] rounded-full"></div>
          </div>
        </header>

        <Card className="p-8 shadow-[var(--shadow-card)] border-[#134611]/70">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold text-primary">
                Inscripción a Actividad
              </h2>
              <span className="text-sm text-muted-foreground">
                Paso {currentStep} de {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {currentStep === 1 && (
            <ActivitySelection onSelectActivity={handleActivitySelect} />
          )}

          {currentStep === 2 && selectedActivity && (
            <DateTimeSelection
              activity={selectedActivity}
              onSelect={handleDateTimeSelect}
              onBack={handleBack}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedSlots={selectedTimeSlots}
              currentMonth={calendarMonth}
              onChange={handleDateTimeChange}
              onMonthChange={handleMonthChange}
            />
          )}

          {currentStep === 3 && selectedActivity && (
            <ParticipantsForm
              activity={selectedActivity}
              availableSlots={selectedTimeSlots}
              onSubmit={handleParticipantsSubmit}
              onBack={handleBack}
              initialParticipants={participants}
              onChange={handleParticipantsChange}
            />
          )}

          {currentStep === 4 && selectedActivity && (
            <TermsAndConditions
              activity={selectedActivity}
              onAccept={handleTermsAccept}
              onBack={handleBack}
              initialAccepted={termsAccepted}
              onChange={handleTermsChange}
            />
          )}

          {currentStep === 5 && selectedActivity && (
            <RegistrationSummary
              activity={selectedActivity}
              date={selectedDate}
              time={selectedTime}
              horarioId={selectedHorarioId}
              participants={participants}
              onBack={handleBack}
              onReset={handleReset}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;
