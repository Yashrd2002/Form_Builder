import { supabase } from "./supabaseClient";

export interface FormData {
  id:string,
  title: string;
  description: string;
  questions: any[];
}

/**
 * Insert a new form into the 'forms' table
 */
export const saveForm = async (formData: FormData) => {
  const { data, error } = await supabase
    .from("forms")
    .insert([formData])
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
export const UpdateForm = async (formData: FormData) => {
  const { id, title, description, questions } = formData;

  // Update existing form
  const { data, error } = await supabase
    .from("forms")
    .update({ title, description, questions })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

export const fetchForm = async (id: string) => {
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};
