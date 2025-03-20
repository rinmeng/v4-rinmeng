import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

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

// Zod schema for username and password login
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function PlayWright({ values }: PlayWrightProps) {
  // State tracking the CWL login form submission.
  const [cwlAccepted, setCwlAccepted] = useState(false);

  // CWL login form hook using react-hook-form with Zod
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onCwlSubmit = (data: LoginFormValues) => {
    setcwlAcceptedState();
    toast.success("CWL credentials accepted");
    loginForm.reset();
  };

  // Helper to update state (wrap setCwlAccepted to allow future additional logic)
  const setcwlAcceptedState = () => {
    setCwlAccepted(true);
  };

  return (
    <Card className="w-2/3">
      <CardHeader className="text-center">
        <CardTitle>PlayWright Initiated</CardTitle>
        <CardDescription>Please do not close this tab.</CardDescription>
      </CardHeader>
      <CardContent>
        {cwlAccepted ? (
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
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onCwlSubmit)}
                className="border p-4 rounded space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          className="border rounded w-full p-2"
                          placeholder="Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <input
                          type="password"
                          className="border rounded w-full p-2"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Submit CWL
                </Button>
              </form>
            </Form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
