"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

// import { AddExpense } from "@/actions/expenses/add-expense";
import { GetItems } from "@/actions/items/get-items";
import { ItemModel } from "../generated/prisma/models";

// ============ ZOD SCHEMA ============
const formSchema = z.object({
  itemId: z.string().min(1, "Please select an item."),
  cost: z
    .number({ error: "Cost must be a number." })
    .positive("Cost must be greater than 0."),
  date: z.date({ error: "Please pick a date." }),
});

export default function AddExpenseForm() {
  const [items, setItems] = useState<ItemModel[]>([]);
  const [, setLoadingItems] = useState(true);

  // Load items
  useEffect(() => {
    GetItems()
      .then((data) => setItems(data))
      .finally(() => setLoadingItems(false));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemId: undefined,
      cost: undefined,
      date: new Date(),
    },
    mode: "all",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    try {
      // const res = await AddExpense({
      //   itemId: Number(data.itemId),
      //   cost: data.cost,
      //   date: data.date.toISOString().split("T")[0], // YYYY-MM-DD
      // });

      // console.log(res);

      toast("Expense added successfully!", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius) + 4px)",
        } as React.CSSProperties,
      });

      form.reset({ itemId: "", cost: undefined, date: new Date() });
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to add expense.");
    }
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
        <CardDescription>
          Record what you spent, how much, and when
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="form-add-expense" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* ================= ITEM COMBOBOX ================= */}
            <Controller
              name="itemId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Item</FieldLabel>

                  <Combobox
                    items={items.map((i) => i.name)}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <ComboboxInput placeholder="Select an Item" />
                    <ComboboxContent>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.id} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ================= COST ================= */}
            <Controller
              name="cost"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-add-expense-cost">
                    Cost (BDT)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-add-expense-cost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ================= DATE PICKER ================= */}
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Date</FieldLabel>

                  <Popover>
                    <PopoverTrigger>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        aria-invalid={fieldState.invalid}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              form.reset({ itemId: "", cost: undefined, date: new Date() })
            }
          >
            Reset
          </Button>
          <Button type="submit" form="form-add-expense">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
