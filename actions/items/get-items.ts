"use server";

import { prisma } from "@/lib/prisma";

export async function GetItems() {
  const res = await prisma.item.findMany();
  return res;
}
