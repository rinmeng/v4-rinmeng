import { NextResponse } from "next/server";
import playwright from "playwright-core";
import chromium from "@sparticuz/chromium";

const base_booking_url = "https://bookings.ok.ubc.ca/studyrooms/";

export async function POST(request: Request) {
  try {
    const { credentials, values } = await request.json();
    console.log("Received credentials:", credentials);
    console.log("Received values:", values);

    function convertSecondsToTime(seconds: number) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }

    // 🛠️ Launching Chromium in a Serverless-friendly way
    const browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    console.log("Navigating to:", base_booking_url);
    await page.goto(base_booking_url);

    await page.click('//input[@value="Log in"]');

    console.log("Logging in...");

    // Fill login details
    await page.fill("#username", credentials.username);
    await page.fill("#password", credentials.password);
    await page.click('//button[@type="submit"]');

    // Handle login errors
    let errorElement;
    try {
      errorElement = await page.waitForSelector(".login_error", {
        timeout: 5000,
      });
    } catch (error) {
      console.log(error);
    }

    if (errorElement) {
      const errorText = await errorElement.textContent();
      console.log("Login error:", errorText);
      await browser.close();
      return NextResponse.json({ success: false, errorText }, { status: 400 });
    }

    // Wait for Duo authentication
    console.log("Waiting for Duo authentication...");
    while ((await page.url()).includes("duosecurity.com")) {
      try {
        const duoButton = await page.waitForSelector("#trust-browser-button", {
          timeout: 5000,
        });
        if (duoButton) {
          await duoButton.click();
          console.log("Clicked Duo trust button.");
        }
      } catch (error) {
        console.error("Duo trust button not found.");
        console.error(error);
        break;
      }
      await page.waitForTimeout(2000);
    }

    console.log("Authentication completed.");

    let roomsBooked = 0;
    let sessionEnd;

    while (values.start_time < values.end_time && roomsBooked < 3) {
      try {
        sessionEnd = Math.min(values.start_time + 7200, values.end_time);

        const bookingUrl =
          `https://bookings.ok.ubc.ca/studyrooms/edit_entry.php?drag=1` +
          `&area=${values.area}` +
          `&start_seconds=${values.start_time}` +
          `&end_seconds=${sessionEnd}` +
          `&rooms[]=${values.room}` +
          `&start_date=${values.date}`;

        console.log(
          `\nBooking room from ${convertSecondsToTime(values.start_time)}` +
            ` - ${convertSecondsToTime(sessionEnd)}`
        );

        await page.goto(bookingUrl);

        // Fill out form
        await page.fill("#name", values.room_title);
        await page.fill("#description", values.room_title || "Study session");
        await page.selectOption("#type", "W");
        await page.fill("#f_email", values.room_email || credentials.username);

        // Wait for conflict check
        await page.waitForFunction(() => {
          const conflictCheck = document.getElementById("conflict_check");
          return conflictCheck?.getAttribute("title");
        });

        const conflictTitle = await page.$eval("#conflict_check", (el) =>
          el.getAttribute("title")
        );

        if (conflictTitle !== "No scheduling conflicts") {
          console.log("Conflict detected! Skipping session.");
        } else {
          await page.click(".default_action");
          console.log("Room booked successfully!");
          roomsBooked++;
        }

        values.start_time = sessionEnd;

        if (roomsBooked >= 3) break;
      } catch (error) {
        console.log(`Booking attempt failed: ${error}`);
        values.start_time = sessionEnd;
      }
    }

    await browser.close();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
