"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { healthFormSchema, HealthFormType } from "@/lib/form-schema";
import { fieldLabels } from "@/lib/field-labels";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import axios, { AxiosError } from "axios";

const booleanFields = [
  "HighBP",
  "HighChol",
  "CholCheck",
  "Smoker",
  "Stroke",
  "HeartDiseaseorAttack",
  "PhysActivity",
  "Fruits",
  "Veggies",
  "HvyAlcholConsump",
  "AnyHealthcare",
  "NoDocbcCost",
  "DiffWalk",
  "Sex",
];

const categoricalFields = ["GenHlth", "Age", "Education", "Income"];

export default function HealthForm() {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<HealthFormType>({
    resolver: zodResolver(healthFormSchema),
    defaultValues: {
      HighBP: "0",
      HighChol: "0",
      CholCheck: "0",
      BMI: 25,
      Smoker: "0",
      Stroke: "0",
      HeartDiseaseorAttack: "0",
      PhysActivity: "0",
      Fruits: "0",
      Veggies: "0",
      HvyAlcholConsump: "0",
      AnyHealthcare: "0",
      NoDocbcCost: "0",
      DiffWalk: "0",
      Sex: "1",
      Age: 3,
      Education: "3",
      Income: "3",
      GenHlth: "3",
      MentHlth: 0,
      PhysHlth: 0,
    },
  });

  async function onSubmit(data: HealthFormType) {
    const orderedData = {
      HighBP: data.HighBP,
      HighChol: data.HighChol,
      CholCheck: data.CholCheck,
      BMI: data.BMI,
      Smoker: data.Smoker,
      Stroke: data.Stroke,
      HeartDiseaseorAttack: data.HeartDiseaseorAttack,
      PhysActivity: data.PhysActivity,
      Fruits: data.Fruits,
      Veggies: data.Veggies,
      HvyAlcoholConsump: data.HvyAlcholConsump,
      AnyHealthcare: data.AnyHealthcare,
      NoDocbcCost: data.NoDocbcCost,
      DiffWalk: data.DiffWalk,
      GenHlth: data.GenHlth,
      MentHlth: data.MentHlth,
      PhysHlth: data.PhysHlth,
      Sex: data.Sex,
      Age: data.Age,
      Education: data.Education,
      Income: data.Income,
    };

    try {
      setLoading(true);
      setPrediction(null);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_PREDECTION_API;
      if (!apiUrl) throw new Error("API URL not configured");

      const response = await axios.post(apiUrl, orderedData, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      });

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (error.code === "ECONNABORTED") {
          setError("Request timed out. Please try again.");
        } else if (error.code === "ERR_NETWORK") {
          setError("Cannot connect to the server. Please check your internet connection.");
        } else if (error.response) {
          setError(`Server error: ${error.response.data.message || "Something went wrong"}`);
        } else {
          setError("Unexpected error occurred.");
        }
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          {Object.keys(form.getValues()).map((key) => {
            if (booleanFields.includes(key)) {
              return (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as keyof HealthFormType}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldLabels[key] ?? key}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          defaultValue={String(field.value)}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="1" id={`${key}-yes`} />
                            <label htmlFor={`${key}-yes`}>Yes</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="0" id={`${key}-no`} />
                            <label htmlFor={`${key}-no`}>No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }

            if (categoricalFields.includes(key)) {
              return (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as keyof HealthFormType}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldLabels[key] ?? key}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          defaultValue={String(field.value)}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-4"
                        >
                          {key === "GenHlth" &&
                            ["Excellent", "Very Good", "Good", "Fair", "Poor"].map((label, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <RadioGroupItem value={`${idx + 1}`} id={`${key}-${label}`} />
                                <label htmlFor={`${key}-${label}`}>{label}</label>
                              </div>
                            ))}
                          {key === "Age" &&
                            ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59"].map((label, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <RadioGroupItem value={`${idx + 1}`} id={`${key}-${label}`} />
                                <label htmlFor={`${key}-${label}`}>{label}</label>
                              </div>
                            ))}
                          {key === "Education" &&
                            [
                              "Never attended school",
                              "Elementary School",
                              "Middle School",
                              "High School",
                              "Some college",
                              "College Graduate",
                            ].map((label, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <RadioGroupItem value={`${idx + 1}`} id={`${key}-${label}`} />
                                <label htmlFor={`${key}-${label}`}>{label}</label>
                              </div>
                            ))}
                          {key === "Income" &&
                            [
                              "<$10k",
                              "$10k-$15k",
                              "$15k-$20k",
                              "$20k-$25k",
                              "$25k-$35k",
                              "$35k-$50k",
                              "$50k-$75k",
                              ">$75k",
                            ].map((label, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <RadioGroupItem value={`${idx + 1}`} id={`${key}-${label}`} />
                                <label htmlFor={`${key}-${label}`}>{label}</label>
                              </div>
                            ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }

            return (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof HealthFormType}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldLabels[key] ?? key}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}

          <Button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Submit"}
          </Button>

          {prediction && (
            <p className="text-green-600 font-semibold">Prediction: {prediction}</p>
          )}
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </Form>
    </>
  );
}
