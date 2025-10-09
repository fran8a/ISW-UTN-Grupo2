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
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number>(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivity(activity);
    setCurrentStep(2);
  };

  const handleDateTimeSelect = (date: Date | undefined, time: string, availableSlots: number) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedTimeSlots(availableSlots);
    setCurrentStep(3);
  };

  const handleParticipantsSubmit = (participantsList: Participant[]) => {
    setParticipants(participantsList);
    setCurrentStep(4);
  };

  const handleTermsAccept = (accepted: boolean) => {
    setTermsAccepted(accepted);
    if (accepted) {
      setCurrentStep(5);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedActivity(null);
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedTimeSlots(0);
    setParticipants([]);
    setTermsAccepted(false);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary mb-3 tracking-tight">
            EcoHarmony Park
          </h1>
          <p className="text-muted-foreground text-lg">
            Vive la aventura en armonía con la naturaleza
          </p>
        </header>

        <Card className="p-8 shadow-[var(--shadow-card)] border-border/50">
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
            />
          )}

          {currentStep === 3 && selectedActivity && (
            <ParticipantsForm
              activity={selectedActivity}
              availableSlots={selectedTimeSlots}
              onSubmit={handleParticipantsSubmit}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && selectedActivity && (
            <TermsAndConditions
              activity={selectedActivity}
              onAccept={handleTermsAccept}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && selectedActivity && (
            <RegistrationSummary
              activity={selectedActivity}
              date={selectedDate}
              time={selectedTime}
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
