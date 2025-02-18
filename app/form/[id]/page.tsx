"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import FormFiller from "@/components/FormFiller";

export default function FormFillerPage() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State for loading the form
  const router = useRouter();

  useEffect(() => {
    const fetchForm = async () => {
      setIsLoading(true); // Start loading when fetching form
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching form:", error.message);
      } else {
        setForm(data);
      }
      setIsLoading(false); // End loading after fetching is complete
    };

    fetchForm();
  }, [id]);

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("responses")
      .insert([{ form_id: id, responses }])
      .single();

    if (error) {
      console.error("Error submitting response:", error.message);
    } else {
      console.log("Response submitted successfully:", data);
      router.push(`/form/${id}/thank-you`);
    }
    setIsSubmitting(false);
  };

  // Loading state for the form
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Form not found. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title}</h1>
        <p className="text-gray-700 mb-8">{form.description}</p>

        <FormFiller
          form={form}
          responses={responses}
          onResponseChange={handleResponseChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        {/* <div className="mt-8">
          <button
            onClick={handleSubmit}
            
            disabled={isSubmitting}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div> */}
      </div>
    </div>
  );
}
