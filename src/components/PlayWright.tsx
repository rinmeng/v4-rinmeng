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
  // CWL login form hook using react-hook-form with Zod
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function runPlayWrightAPI(credentials: LoginFormValues): Promise<void> {
    const payload = {
      credentials,
      values,
    };
    const res = await fetch("/api/run-playwright", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success("Playwright executed successfully");
    } else {
      toast.error("Error running Playwright");
    }
  }

  const onCwlSubmit = (data: LoginFormValues) => {
    toast.success("CWL credentials accepted");
    runPlayWrightAPI(data);
  };

  return (
    <Card className="w-full lg:w-1/2">
      <CardHeader className="text-center">
        <CardTitle>PlayWright Initiated</CardTitle>
        <CardDescription>Please do not close this tab.</CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="bg-muted/30 mb-4">
          <CardContent>
            <pre className="text-sm text-wrap">
              {JSON.stringify(values, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CWL Login</CardTitle>
            <CardDescription>
              Please enter your CWL credentials to run the bot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onCwlSubmit)}
                className="space-y-4"
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
                  Login & Run Bot
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
