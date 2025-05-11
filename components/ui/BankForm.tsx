"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bankFormSchema, BankFormType } from "@/lib/bank-form-schema";
import { bankFieldLabels } from "@/lib/bank-field-labels";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

// Define the order of fields
const fieldOrder = ["age", "duration", "campaign", "previous"];

export default function BankForm() {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<BankFormType>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      age: 30,
      duration: 0,
      campaign: 0,
      previous: 0,
    },
  });

  async function onSubmit(data: BankFormType) {
    try {
      setLoading(true);
      setPrediction(null);
      setError(null);

      // Create ordered data object
      const orderedData = {
        age: data.age,
        duration: data.duration,
        campaign: data.campaign,
        previous: data.previous
      };

      console.log("Sending data:", orderedData);

      const apiUrl = process.env.NEXT_PUBLIC_PREDECTION_API_BANK;
      if (!apiUrl) throw new Error("API URL not configured");

      const response = await axios.post(apiUrl, orderedData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setError("Request timed out. Please try again.");
        } else if (error.code === 'ERR_NETWORK') {
          setError("Cannot connect to the server. Please check your internet connection and try again.");
        } else if (error.response) {
          setError(`Server error: ${error.response.data.message || 'Something went wrong'}`);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          {fieldOrder.map((key) => (
            <FormField
              key={key}
              control={form.control}
              name={key as keyof BankFormType}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">{bankFieldLabels[key]}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit"}
          </Button>
        </form>
      </Form>
      
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {prediction && (
        <div className="mt-4 text-green-600 font-extrabold bg-secondary shadow-2xl rounded-2xl w-full uppercase p-5 m-3.5">
          Prediction: {prediction === "yes" ? "Client will subscribe to term deposit" : "Client will not subscribe to term deposit"}
        </div>
      )}
    </>
  );
}

