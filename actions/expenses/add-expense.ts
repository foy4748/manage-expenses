"use server";

import { Expense } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function AddExpense(data: Expense[]) {
  const res = await prisma.expense.createMany({ data });
  return res;
}
