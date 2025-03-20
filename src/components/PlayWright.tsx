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
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Define a type for the formatted booking values
export type FormattedValues = {
  area: string;
  room: string;
  date: string;
  start_time: number;
  end_time: number;
  room_title: string;
  room_email: string;
};

interface PlayWrightProps {
  values: FormattedValues;
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
    setCwlAccepted(true);
    toast.success("CWL credentials accepted");
    loginForm.reset();
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
                        <Input type="text" placeholder="Username" {...field} />
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
                        <Input
                          type="password"
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
