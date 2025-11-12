import { CalendarDays } from "lucide-react";

const Consultation = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book Consultation</h1>
        <p className="text-muted-foreground">Schedule a call with our team</p>
      </div>
      
      <div className="flex items-center justify-center h-96 bg-muted/30 rounded-3xl">
        <div className="text-center">
          <CalendarDays className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Consultation booking coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
