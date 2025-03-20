"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { config, areaMap, roomsMap } from "@/lib/config";
import { toast, Toaster } from "sonner";
import PlayWright from "@/components/PlayWright";

// Convert seconds to HH:mm format
const secondsToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

// Helper to convert minutes (since midnight) to AM/PM time string
const formatMinutesToAMPM = (totalMinutes: number) => {
  const hour24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Updated generateTimeSlots function with AM/PM formatting
const generateTimeSlots = (isEndTime: boolean = false, startTime?: string) => {
  const slots: string[] = [];

  if (isEndTime && startTime) {
    const [hourStr, minuteStr] = startTime.split(/[: ]/);
    let hour = Number(hourStr);
    const minute = Number(minuteStr);
    const period = startTime.includes("PM") ? "PM" : "AM";
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    const startTotalMinutes = hour * 60 + minute;

    if (startTotalMinutes === 0) {
      return ["12:30 AM"];
    }

    const minEndTimeMinutes = startTotalMinutes + 30;
    const maxEndTimeMinutes = Math.min(
      startTotalMinutes + 6 * 60,
      24 * 60 + 30
    );

    for (let i = minEndTimeMinutes; i <= maxEndTimeMinutes; i += 30) {
      slots.push(formatMinutesToAMPM(i));
    }
  } else {
    for (let i = 6 * 60; i <= 24 * 60; i += 30) {
      slots.push(formatMinutesToAMPM(i));
    }
  }

  return slots;
};

const getRoomPrefix = (area: string) => {
  switch (area) {
    case "Library":
      return "LIB";
    case "Commons: Floor 0":
      return "COM 0";
    case "Commons: Floor 1":
      return "COM 1";
    case "Commons: Floor 3":
      return "COM 3";
    case "EME: Tower 1":
      return "EME 116";
    case "EME: Tower 2":
      return "(EME 1252|EME 1254|EME 2)";
    default:
      return "";
  }
};

const formSchema = z.object({
  area: z.string(),
  room: z.string(),
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Invalid email address"),
});

type FormattedValues = {
  area: string;
  room: string;
  date: string;
  start_time: number;
  end_time: number;
  room_title: string;
  room_email: string;
};

export function RoomBookingForm() {
  const [initPlaywright, setInitPlaywright] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>();
  const [formattedValues, setFormattedValues] =
    useState<FormattedValues | null>(null);

  const reverseAreaMap = Object.fromEntries(
    Object.entries(areaMap).map(([key, value]) => [value, key])
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area: reverseAreaMap[1],
      room: "",
      date: new Date(config.date),
      startTime: formatMinutesToAMPM(config.start_time / 60),
      endTime: formatMinutesToAMPM(config.end_time / 60),
      title: config.room_title,
      email: config.email,
    },
  });

  useEffect(() => {
    if (selectedArea) {
      const prefix = getRoomPrefix(selectedArea);
      const filteredRooms = Object.keys(roomsMap).filter((room) =>
        new RegExp(`^(${prefix})`).test(room)
      );
      if (
        filteredRooms.length > 0 &&
        !filteredRooms.includes(form.getValues("room"))
      ) {
        form.setValue("room", filteredRooms[0]);
      }
    }
  }, [selectedArea, form]);

  const timeToSeconds = (time: string): number => {
    const [timePart, period] = time.split(" ");
    const [hourStr, minuteStr] = timePart.split(":");
    let hour = Number(hourStr);
    const minute = Number(minuteStr);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour * 3600 + minute * 60;
  };

  function isValidArea(area: string): area is keyof typeof areaMap {
    return area in areaMap;
  }

  function isValidRoom(room: string): room is keyof typeof roomsMap {
    return room in roomsMap;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isValidArea(values.area) || !isValidRoom(values.room)) {
      toast.error("Invalid area or room selection");
      return;
    }

    const calcFormattedValues: FormattedValues = {
      area: areaMap[values.area].toString(),
      room: roomsMap[values.room].toString(),
      date: format(values.date, "yyyy-MM-dd"),
      start_time: timeToSeconds(values.startTime),
      end_time: timeToSeconds(values.endTime),
      room_title: values.title,
      room_email: values.email,
    };

    console.log(calcFormattedValues);
    toast.success("Booking submitted, please proceed to the next panel.");
    setFormattedValues(calcFormattedValues);
    setInitPlaywright(true);
  }

  const [selectedStartTime, setSelectedStartTime] = useState(
    secondsToTime(config.start_time)
  );

  return (
    <>
      <div className="flex justify-center w-3/4 gap-4 h-auto">
        <Card className="w-1/3">
          <CardHeader>
            <CardTitle>UBCO Booking Bot</CardTitle>
            <CardDescription>
              Now with prometheus v2 + Playwright.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Building</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedArea(value);
                          const prefix = getRoomPrefix(value);
                          const filteredRooms = Object.keys(roomsMap).filter(
                            (room) => new RegExp(`^(${prefix})`).test(room)
                          );
                          if (filteredRooms.length > 0) {
                            form.setValue("room", filteredRooms[0]);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select building" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(areaMap).map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(roomsMap)
                            .filter((room) => {
                              const prefix = getRoomPrefix(selectedArea || "");
                              return new RegExp(`^(${prefix})`).test(room);
                            })
                            .map((room) => (
                              <SelectItem key={room} value={room}>
                                {room}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl className="w-full">
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date > new Date(2025, 11, 31)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedStartTime(value);
                            const minEndTime = generateTimeSlots(
                              true,
                              value
                            )[0];
                            form.setValue("endTime", minEndTime);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Start time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {generateTimeSlots().map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="End time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {generateTimeSlots(true, selectedStartTime).map(
                              (time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl className="w-full">
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl className="w-full">
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={initPlaywright}
                >
                  Submit Room
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        {initPlaywright && formattedValues && (
          <PlayWright values={formattedValues} />
        )}
      </div>
      <Toaster />
    </>
  );
}

export default RoomBookingForm;
