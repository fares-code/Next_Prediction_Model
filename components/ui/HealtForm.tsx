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
  "Sex", // Sex will also be a radio input
];

const categoricalFields = [
  "GenHlth",
  "Age",
  "Education",
  "Income",
];

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
      Sex: "1", // Male by default
      Age: 3, // Adjusted default value for age to 30-34
      Education: "3", // Primary School by default
      Income: "3", // Adjusted default value for income to 15k-20k
      GenHlth: "3", // Good by default
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
      Veggies: data.Veggies,
      HvyAlcoholConsump: data.HvyAlcholConsump,
      AnyHealthcare: data.AnyHealthcare,
      NoDocbcCost: data.NoDocbcCost,
      GenHlth: data.GenHlth,
      MentHlth: data.MentHlth,
      PhysHlth: data.PhysHlth,
      Sex: data.Sex,
      Age: data.Age,
      Education: data.Education,
      Income: data.Income,
    };
  
    console.log(orderedData); 
  
    try {
      setLoading(true);
      setPrediction(null);
      setError(null);
  
      const apiUrl = process.env.NEXT_PUBLIC_PREDECTION_API;
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
      if (error instanceof AxiosError) {
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
          {Object.keys(form.getValues()).map((key) => {
            if (booleanFields.includes(key)) {
              return (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as keyof HealthFormType}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">{fieldLabels[key] ?? key}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          defaultValue={String(field.value)}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-4"
                        >
                          {key === "Sex" ? (
                            <>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="1" id={`${key}-male`} />
                                <label htmlFor={`${key}-male`} className="text-sm md:text-base">Male</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="0" id={`${key}-female`} />
                                <label htmlFor={`${key}-female`} className="text-sm md:text-base">Female</label>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="1" id={`${key}-yes`} />
                                <label htmlFor={`${key}-yes`} className="text-sm md:text-base">Yes</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="0" id={`${key}-no`} />
                                <label htmlFor={`${key}-no`} className="text-sm md:text-base">No</label>
                              </div>
                            </>
                          )}
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
                      <FormLabel className="text-sm md:text-base">{fieldLabels[key] ?? key}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          defaultValue={String(field.value)}
                          onValueChange={(value) => field.onChange(Number(value))}
                          className="flex gap-4 flex-wrap"
                        >
                          {key === "GenHlth" && (
                            <>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="1" id="health-excellent" />
                                <label htmlFor="health-excellent" className="text-sm md:text-base">Excellent</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="2" id="health-very-good" />
                                <label htmlFor="health-very-good" className="text-sm md:text-base">Very Good</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="3" id="health-good" />
                                <label htmlFor="health-good" className="text-sm md:text-base">Good</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="4" id="health-fair" />
                                <label htmlFor="health-fair" className="text-sm md:text-base">Fair</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="5" id="health-poor" />
                                <label htmlFor="health-poor" className="text-sm md:text-base">Poor</label>
                              </div>
                            </>
                          )}
                         {key === "Age" && (
  <>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="1" id="age-18-24" defaultChecked />
      <label htmlFor="age-18-24" className="text-sm md:text-base">18-24</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="2" id="age-25-29" />
      <label htmlFor="age-25-29" className="text-sm md:text-base">25-29</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="3" id="age-30-34" />
      <label htmlFor="age-30-34" className="text-sm md:text-base">30-34</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="4" id="age-35-39" />
      <label htmlFor="age-35-39" className="text-sm md:text-base">35-39</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="5" id="age-40-44" />
      <label htmlFor="age-40-44" className="text-sm md:text-base">40-44</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="6" id="age-45-49" />
      <label htmlFor="age-45-49" className="text-sm md:text-base">45-49</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="7" id="age-50-54" />
      <label htmlFor="age-50-54" className="text-sm md:text-base">50-54</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="8" id="age-55-59" />
      <label htmlFor="age-55-59" className="text-sm md:text-base">55-59</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="9" id="age-60-64" />
      <label htmlFor="age-60-64" className="text-sm md:text-base">60-64</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="10" id="age-65-69" />
      <label htmlFor="age-65-69" className="text-sm md:text-base">65-69</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="11" id="age-70-74" />
      <label htmlFor="age-70-74" className="text-sm md:text-base">70-74</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="12" id="age-75-79" />
      <label htmlFor="age-75-79" className="text-sm md:text-base">75-79</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="13" id="age-80-plus" />
      <label htmlFor="age-80-plus" className="text-sm md:text-base">80 or Higher</label>
    </div>
  </>
)}

                          {key === "Education" && (
                            <>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="1" id="education-uneducated" />
                                <label htmlFor="education-uneducated" className="text-sm md:text-base">Uneducated</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="2" id="education-primary" />
                                <label htmlFor="education-primary" className="text-sm md:text-base">Primary School</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="3" id="education-secondary" />
                                <label htmlFor="education-secondary" className="text-sm md:text-base">Secondary School</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="4" id="education-undergraduate" />
                                <label htmlFor="education-undergraduate" className="text-sm md:text-base">Undergraduate</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="5" id="education-postgraduate" />
                                <label htmlFor="education-postgraduate" className="text-sm md:text-base">Postgraduate</label>
                              </div>
                            </>
                          )}
                          {key === "Income" && (
                            <>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="1" id="income-10k" />
                                <label htmlFor="income-10k" className="text-sm md:text-base">Less than 10k</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="2" id="income-10k-15k" />
                                <label htmlFor="income-10k-15k" className="text-sm md:text-base">10k - 15k</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="3" id="income-15k-20k" />
                                <label htmlFor="income-15k-20k" className="text-sm md:text-base">15k - 20k</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="4" id="income-20k-25k" />
                                <label htmlFor="income-20k-25k" className="text-sm md:text-base">20k - 25k</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="5" id="income-25k-30k" />
                                <label htmlFor="income-25k-30k" className="text-sm md:text-base">25k - 30k</label>
                              </div>
                            </>
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }
            return null;
          })}

          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {prediction && <div className="mt-4 text-green-600 font-extrabold bg-secondary shadow-2xl rounded-2xl w-full uppercase p-5 m-3.5" > The Predction : {prediction === "1" ? "Yes may have diabetes " : "you may not have diabetes (healthy)"} </div>}
    </>
  );
}
