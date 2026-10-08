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

export async function AddAllItems() {
  const data = [
    { name: "Mobile Recharge" },
    { name: "Medical" },
    { name: "Toiletries" },
    { name: "Fee" },
    { name: "Breakfast" },
    { name: "Transfer" },
    { name: "Gift Item" },
    { name: "Photocopy" },
    { name: "Meal" },
    { name: "Clothing" },
    { name: "Internet Bill" },
    { name: "Books" },
    { name: "Cosmetics" },
    { name: "Iftar" },
    { name: "Due" },
    { name: "Mess Bill" },
    { name: "Interest Nullify" },
    { name: "Electricity Bill" },
    { name: "Ritu's Mahr Paid" },
    { name: "Investment" },
    { name: "Lost" },
    { name: "Zakat" },
    { name: "Gardening" },
    { name: "Salami" },
    { name: "Tax" },
    { name: "Fitra" },
    { name: "Decoration" },
    { name: "Gas Bill" },
    { name: "Utility Bill" },
  ];

  const res = await prisma.item.createMany({
    data,
  });
  return res;
}
