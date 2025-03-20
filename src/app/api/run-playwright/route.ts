import { NextResponse } from "next/server";
import { chromium } from "playwright";

export async function POST(request: Request) {
  try {
    const { credentials, values } = await request.json();
    console.log("Received credentials:", credentials);
    console.log("Received values:", values);

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://example.com");
    console.log("Page title:", await page.title());
    await browser.close();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
