import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "@/components/ui/button";

// Define a type for the booking form values based on your RoomBookingForm schema
interface BookingFormValues {
  area: string;
  room: string;
  date: Date;
  startTime: string;
  endTime: string;
  title: string;
  email: string;
}

interface PlayWrightProps {
  values: BookingFormValues;
}

export default function PlayWright({ values }: PlayWrightProps) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    toast.success("Booking accepted through PlayWright automation");
  };

  return (
    <Card className="w-2/3">
      <CardHeader className="text-center">
        <CardTitle>PlayWright Initiated</CardTitle>
        <CardDescription>Please do not close this tab.</CardDescription>
      </CardHeader>
      <CardContent>
        {accepted ? (
          <div className="text-center font-semibold text-lg">
            Booking Accepted
          </div>
        ) : (
          <>
            <Card className="bg-muted/30 mb-4">
              <CardHeader>
                <CardTitle>Form Values</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm">{JSON.stringify(values, null, 2)}</pre>
              </CardContent>
            </Card>
            <Button onClick={handleAccept} className="w-full">
              Accept Booking
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
