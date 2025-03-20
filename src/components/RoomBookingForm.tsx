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
    // Convert startTime string like "12:00 AM" or "6:00 AM" to 24-hour minutes
    let hour = Number(hourStr);
    const minute = Number(minuteStr);
    const period = startTime.includes("PM") ? "PM" : "AM";
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    const startTotalMinutes = hour * 60 + minute;

    // Special case for "12:00 AM"
    if (startTotalMinutes === 0) {
      return ["12:30 AM"];
    }

    // End times should be at least 30 minutes after start time
    const minEndTimeMinutes = startTotalMinutes + 30;
    // Maximum end time is either 6 hours ahead or 12:30 AM (which is 1470 minutes)
    const maxEndTimeMinutes = Math.min(
      startTotalMinutes + 6 * 60,
      24 * 60 + 30
    );

    for (let i = minEndTimeMinutes; i <= maxEndTimeMinutes; i += 30) {
      slots.push(formatMinutesToAMPM(i));
    }
  } else {
    // For start time slots: from 6:00 AM (360 minutes) to midnight (1440 minutes)
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
      return "EME 116"; // Only match EME 116x rooms for Tower 1
    case "EME: Tower 2":
      return "(EME 1252|EME 1254|EME 2)"; // Match EME 1252, 1254, and all EME 2xxx rooms
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

export function RoomBookingForm() {
  const [selectedArea, setSelectedArea] = useState<string>();
  const reverseAreaMap = Object.fromEntries(
    Object.entries(areaMap).map(([key, value]) => [value, key])
  );

  //   const reverseRoomsMap = Object.fromEntries(
  //     Object.entries(roomsMap).map(([key, value]) => [value, key])
  //   );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area: reverseAreaMap[1],
      room: "",
      date: new Date(config.date),
      startTime: formatMinutesToAMPM(config.start_time / 60), // Converts seconds to minutes then AM/PM
      endTime: formatMinutesToAMPM(config.end_time / 60), // Converts seconds to minutes then AM/PM
      title: config.room_title,
      email: config.email,
    },
  });

  // Whenever the selectedArea changes, re‑evaluate the room value.
  useEffect(() => {
    if (selectedArea) {
      const prefix = getRoomPrefix(selectedArea);
      const filteredRooms = Object.keys(roomsMap).filter((room) =>
        new RegExp(`^(${prefix})`).test(room)
      );
      // If the current room is not valid for the new building, update it.
      if (
        filteredRooms.length > 0 &&
        !filteredRooms.includes(form.getValues("room"))
      ) {
        form.setValue("room", filteredRooms[0]);
      }
    }
  }, [selectedArea, form]);

  // Updated timeToSeconds function to parse AM/PM formatted times
  const timeToSeconds = (time: string): number => {
    const [timePart, period] = time.split(" ");
    const [hourStr, minuteStr] = timePart.split(":");
    let hour = Number(hourStr);
    const minute = Number(minuteStr);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour * 3600 + minute * 60;
  };

  // Add these type checks
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

    const formattedValues = {
      area: areaMap[values.area],
      room: roomsMap[values.room],
      date: format(values.date, "yyyy-MM-dd"),
      start_time: timeToSeconds(values.startTime),
      end_time: timeToSeconds(values.endTime),
      room_title: values.title,
      room_email: values.email,
    };

    console.log(formattedValues);
    toast.success("Room values: " + JSON.stringify(formattedValues));
  }

  // Add this state to track the selected start time
  const [selectedStartTime, setSelectedStartTime] = useState(
    secondsToTime(config.start_time)
  );

  return (
    <>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>UBCO Booking Bot</CardTitle>
          <CardDescription>
            Now with prometheus v2 + Playwright.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        // Filter rooms based on the selected building's prefix
                        const prefix = getRoomPrefix(value);
                        const filteredRooms = Object.keys(roomsMap).filter(
                          (room) => new RegExp(`^(${prefix})`).test(room)
                        );
                        // If there is at least one room for the building, update the room field with the first room
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
                      value={field.value} // controlled value always reflects the current room
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
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
                          // Automatically update end time when start time changes
                          const minEndTime = generateTimeSlots(true, value)[0];
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

              <Button type="submit" className="w-full">
                Book Room
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Toaster />
    </>
  );
}

export default RoomBookingForm;
