import { GetItems } from "@/actions/items/get-items";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await GetItems();

  return NextResponse.json({ error: false, message: "Item Data", data });
}
