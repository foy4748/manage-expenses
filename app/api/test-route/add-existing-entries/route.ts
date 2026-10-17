import { AddExpense } from "@/actions/expenses/add-expense";
import fs from "fs/promises";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const raw = await fs.readFile("data/expenses.json", "utf-8");
    const data = JSON.parse(raw, (_, value) => {
      // ISO date strings look like: "2024-01-15T10:30:00.000Z"
      if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
      ) {
        return new Date(value);
      }
      return value;
    });

    const res = await AddExpense(data);
    return NextResponse.json({ error: false, data: res });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: true });
  }
};
