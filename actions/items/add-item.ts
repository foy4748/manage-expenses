"use server";

import { prisma } from "@/lib/prisma";

export async function AddItem(data: { item: string }) {
  const res = await prisma.item.create({
    data: {
      name: data.item,
    },
  });
  return res;
}
