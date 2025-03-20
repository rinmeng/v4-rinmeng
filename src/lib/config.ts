export const config = {
  area: 1,
  room: 2,
  date: "2025-03-25",
  start_time: 21600,
  end_time: 43200,
  room_title: "Booked by UBCOBookingBot",
  room_description: "",
  phone_number: "",
  email: "prometheus@rinm.dev",
} as const;

export const roomsMap = {
  "LIB 121 (4 people)": 2,
  "LIB 122 (4)": 1,
  "COM 005 (4 people)": 12,
  "COM 006 (4)": 13,
  "COM 007 (4)": 14,
  "COM 008 (4)": 15,
  "COM 108 (4 people)": 16,
  "COM 109 (4)": 17,
  "COM 110 (10)": 18,
  "COM 111 (10)": 19,
  "COM 112 (6)": 20,
  "COM 113 (4)": 21,
  "COM 114 (6)": 22,
  "COM 115 (4)": 23,
  "COM 116 (6)": 24,
  "COM 117 (6)": 25,
  "COM 118 (6)": 26,
  "COM 119 (6)": 27,
  "COM 120 (6)": 28,
  "COM 301 (4 people)": 30,
  "COM 302 (4)": 31,
  "COM 303 (4)": 32,
  "COM 304 (4)": 33,
  "COM 305 (6)": 34,
  "COM 306 (4)": 35,
  "COM 307 (6)": 36,
  "COM 308 (4)": 37,
  "COM 309 (6)": 38,
  "COM 312 (4)": 39,
  "COM 314 (4)": 40,
  "COM 316 (4)": 41,
  "COM 318 (4)": 42,
  "EME 1162 (10 people)": 54,
  "EME 1163 (6)": 55,
  "EME 1164 (6)": 56,
  "EME 1165 (6)": 57,
  "EME 1166 (6)": 58,
  "EME 1167 (6)": 59,
  "EME 1168 (6)": 60,
  "EME 1252 (10 people)": 43,
  "EME 1254 (8)": 44,
  "EME 2242 (8)": 46,
  "EME 2244 (8)": 48,
  "EME 2246 (8)": 49,
  "EME 2248 (8)": 50,
  "EME 2252 (8)": 51,
  "EME 2254 (8)": 52,
  "EME 2257 (10)": 53,
} as const;

export const areaMap = {
  Library: 1,
  "Commons: Floor 0": 5,
  "Commons: Floor 1": 6,
  "Commons: Floor 3": 7,
  "EME: Tower 1": 8,
  "EME: Tower 2": 9,
} as const;
