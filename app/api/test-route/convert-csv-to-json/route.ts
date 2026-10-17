import { NextResponse } from "next/server";

import fs from "fs";
import { parse } from "csv"; // or require('csv')
import { GetItems } from "@/actions/items/get-items";

const results: { Item: string; "Cost (BDT)": string; Date: "string" }[] = [];
const updatedToJson: { cost: number; date: Date; itemId: number }[] = [];

export async function POST(request: Request) {
  const items = await GetItems();
  const MappedItems = Object.fromEntries(
    items.map((item) => [item.name, item.id]),
  );
  console.log(MappedItems);
  try {
    const data = request.body;
    console.log(data);
    fs.createReadStream("data/Expenses.csv")
      .pipe(
        parse({
          columns: true, // Automatically treats the first line as headers and creates objects
          skip_empty_lines: true, // Prevents parsing errors on trailing empty lines
        }),
      )
      .on("data", (row) => {
        results.unshift(row);
      })
      .on("end", () => {
        console.log("CSV file successfully processed:");
        for (const record of results) {
          const expense = {
            cost: Number(record["Cost (BDT)"]),
            date: new Date(record.Date),
            itemId: Number(MappedItems[record.Item.trim()]),
          };
          updatedToJson.push(expense);
        }
        console.log(updatedToJson);
        fs.writeFile(
          "data/Expenses.json",
          JSON.stringify(updatedToJson, null, 2),
          "utf8",
          (err) => {
            if (err) {
              console.error("Error writing file:", err);
              return;
            }
            console.log("File written successfully!");
          },
        );
      })
      .on("error", (err) => {
        console.error("Error reading CSV:", err.message);
        return NextResponse.json({
          error: true,
          message: `Something Went Wrong \n. ${err.cause} \n ${err.message} \n`,
        });
      })
      .on("finish", () => {
        return NextResponse.json({
          error: false,
          message: "All OK",
          data: updatedToJson,
        });
      });

    return NextResponse.json({
      error: false,
      message: "All OK",
      data: [],
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      error: true,
      message: `Something Went Wrong \n.`,
    });
  }
}
