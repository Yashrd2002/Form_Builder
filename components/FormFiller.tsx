"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FormFiller({
  form,
  responses,
  onResponseChange,
  onSubmit,
  isSubmitting
}: {
  form: any;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileUpload = async (questionId: string, file: File) => {
    try {
      // Generate a unique ID for the file (e.g., using UUID or timestamp)
      const uniqueId =
        Date.now().toString(36) + Math.random().toString(36).substring(2);

      // Extract the file extension
      const fileExtension = file.name.split(".").pop();

      // Create a unique file name
      const uniqueFileName = `${uniqueId}.${fileExtension}`;

      // Create the storage path using the unique file name
      const filePath = `uploads/${questionId}/${uniqueFileName}`;

      // Upload the file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("app")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false, // Prevent overwriting if file exists
        });

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("app").getPublicUrl(filePath);

      console.log("File uploaded successfully:", publicUrl);
      onResponseChange(questionId, publicUrl);
    } catch (error:any) {
      console.error("Error uploading file:", error.message);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    form.questions.forEach((question: any) => {
      if (question.required && !responses[question.id]) {
        newErrors[question.id] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      onSubmit(); // Call the parent's submit handler
    } else {
      console.log("Form has errors. Please fix them.");
    }
  };

  return (
    <div className="space-y-4">
      {form.questions.map((question: any, index: number) => (
        <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {index + 1}. {question.questionText}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h3>

          {/* Display error message if the field is required and empty */}
          {errors[question.id] && (
            <p className="text-red-500 text-sm mb-2">{errors[question.id]}</p>
          )}

          {/* Text Input */}
          {question.type === "text" && (
            <input
              type="text"
              value={responses[question.id] || ""}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your answer"
            />
          )}

          {/* Multiple Choice */}
          {question.type === "multipleChoice" && (
            <div className="space-y-2">
              {question.options?.map((option: string, i: number) => (
                <label key={i} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={responses[question.id] === option}
                    onChange={() => onResponseChange(question.id, option)}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Checkbox */}
          {question.type === "checkbox" && (
            <div className="space-y-2">
              {question.options?.map((option: string, i: number) => (
                <label key={i} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={responses[question.id]?.includes(option) || false}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(responses[question.id] || []), option]
                        : responses[question.id]?.filter(
                            (v: string) => v !== option
                          );
                      onResponseChange(question.id, newValue);
                    }}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* File Upload */}
          {question.type === "fileUpload" && (
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    handleFileUpload(question.id, file);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                accept={question.fileTypes?.join(",")}
              />
              <span className="text-sm text-gray-500">
                Accepted file types: {question.fileTypes?.join(", ")}
              </span>
            </div>
          )}

          {/* Short Answer */}
          {question.type === "shortAnswer" && (
            <input
              type="text"
              value={responses[question.id] || ""}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your answer"
            />
          )}
        </div>
      ))}

      {/* Submit Button */}
        <div className="mt-8">
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
        </div>
    </div>
  );
}
