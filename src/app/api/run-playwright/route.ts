import { NextResponse } from "next/server";
import { chromium } from "playwright";

const base_booking_url: string = "https://bookings.ok.ubc.ca/studyrooms/";

let rooms_booked;

export async function POST(request: Request) {
  try {
    const { credentials, values } = await request.json();
    console.log("Received credentials:", credentials);
    console.log("Received values:", values);

    // Received credentials: { username: 'bla bla', password: 'secretbla' }
    // Received values: {
    //   area: '1',
    //   room: '2',
    //   date: '2025-03-24',
    //   start_time: 21600,
    //   end_time: 43200,
    //   room_title: 'Booked by UBCOBookingBot',
    //   room_email: 'prometheus@rinm.dev'
    // }

    function convertSecondsToTime(seconds: number): string {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log("Visiting page: ", await page.title());
    await page.goto(base_booking_url);
    await page.click('//input[@value="Log in"]');

    console.log("Logging user in...");

    // fill in password and username
    await page.fill("#username", credentials.username);
    await page.fill("#password", credentials.password);

    // click the login button
    await page.click('//button[@type="submit"]');

    // check if there is any error logging in...
    let errorElement;

    try {
      errorElement = await page.waitForSelector(".login_error", {
        timeout: 5000,
      });

      // ther must be no error if it passes here
    } catch (error) {
      // do nothing
      console.log(error);
    }

    if (errorElement) {
      const errorText = await errorElement.textContent();
      console.log("Login error text:", errorText);
      return NextResponse.json({ success: false, errorText }, { status: 400 });
    } else {
      console.log("No login error element found.");
    }

    // Wait until the URL no longer contains "authentication.ubc.ca"
    while ((await page.url()).includes("authentication.ubc.ca")) {
      console.log("Waiting for user to leave: authentication.ubc.ca");
      await page.waitForTimeout(1000);
    }

    // Duo authentication part
    console.log("Check your phone for duo authentication...");
    while ((await page.url()).includes("duosecurity.com")) {
      try {
        // Wait for the "Trust this browser" button to appear
        const duoButton = await page.waitForSelector("#trust-browser-button", {
          timeout: 5000,
        });
        if (duoButton) {
          await duoButton.click();
          console.log("Clicked the trust browser button.");
        } else {
          console.log("Trust browser button not found, skipping click.");
          break;
        }
      } catch (error) {
        console.error(
          "Error finding or clicking the trust browser button:",
          error
        );
        break;
      }
      await page.waitForTimeout(2000);
    }
    console.log("Authentication completed.");

    rooms_booked = 0;

    let session_end;

    while (values.start_time < values.end_time && rooms_booked < 3) {
      try {
        session_end = Math.min(values.start_time + 7200, values.end_time);

        const url =
          `https://bookings.ok.ubc.ca/studyrooms/edit_entry.php?drag=1` +
          `&area=${values.area}` +
          `&start_seconds=${values.start_time}` +
          `&end_seconds=${session_end}` +
          `&rooms[]=${values.room}` +
          `&start_date=${values.date}` +
          `&top=0`;

        console.log(
          `\nBooking room from ${convertSecondsToTime(values.start_time)}` +
            ` - ${convertSecondsToTime(session_end)}`
        );
        await page.goto(url);

        // Fill out the form fields
        await page.fill("#name", values.room_title);
        await page.fill("#description", values.room_title || "Study session");

        // Select room type using the dropdown
        await page.selectOption("#type", "W");

        // Fill additional details
        await page.fill("#f_phone", credentials.phone || "");
        await page.fill("#f_email", values.room_email || credentials.username);

        // Wait for conflict checks to complete
        await page.waitForFunction(() => {
          const conflictCheck = document.getElementById("conflict_check");
          const policyCheck = document.getElementById("policy_check");
          return (
            conflictCheck?.getAttribute("title") &&
            policyCheck?.getAttribute("title")
          );
        });

        // Check for conflicts
        const conflictTitle = await page.$eval("#conflict_check", (el) =>
          el.getAttribute("title")
        );
        const policyTitle = await page.$eval("#policy_check", (el) =>
          el.getAttribute("title")
        );

        if (
          conflictTitle !== "No scheduling conflicts" ||
          policyTitle !== "No policy conflicts"
        ) {
          console.log("Conflict detected! Skipping this session.");
          console.log("Conflict:", conflictTitle);
          console.log("Policy:", policyTitle);

          if (
            policyTitle?.includes("maximum") ||
            policyTitle?.includes("3 weeks")
          ) {
            rooms_booked = 3;
            console.log("Booking limit reached.");
            break;
          }
        } else {
          // Submit the form
          await page.click(".default_action");
          console.log("Room booked successfully!");
          rooms_booked += 1;
        }

        // Move to next time slot
        values.start_time = session_end;

        // Check if we've reached the booking limit
        if (rooms_booked >= 3) {
          rooms_booked = 0;
          const bookedUrl =
            `https://bookings.ok.ubc.ca/studyrooms/index.php?view=day` +
            `&page_date=${values.date}` +
            `&area=${values.area}`;
          await page.goto(bookedUrl);
          break;
        }
      } catch (error) {
        console.log(`Error during booking attempt: ${error}`);
        values.start_time = session_end; // Move to next slot even if current fails
        continue;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
