"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";

export default function FormPreviewPage() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
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
      setIsLoading(false);
    };

    fetchForm();
  }, [id]);

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!form) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          Form not found
        </Typography>
      </Container>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <Container maxWidth="lg" className="flex-grow p-8 overflow-y-auto">
          <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
            Preview: {form.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {form.description}
          </Typography>
          <Box sx={{ mt: 3 }}>
            {form.questions.map((question: any, index: number) => (
              <Card key={question.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {index + 1}. {question.questionText}
                  </Typography>
                  {question.type === "text" && (
                    <TextField fullWidth variant="outlined" disabled />
                  )}
                  {question.type === "multipleChoice" && (
                    <Box>
                      {question.options?.map((option: string, i: number) => (
                        <FormControlLabel
                          key={i}
                          control={<Checkbox disabled />}
                          label={option}
                        />
                      ))}
                    </Box>
                  )}
                  {question.type === "checkbox" && (
                    <Box>
                      {question.options?.map((option: string, i: number) => (
                        <FormControlLabel
                          key={i}
                          control={<Checkbox disabled />}
                          label={option}
                        />
                      ))}
                    </Box>
                  )}
                  {question.type === "fileUpload" && (
                    <TextField
                      fullWidth
                      type="file"
                      disabled
                      inputProps={{ accept: question.fileTypes?.join(",") }}
                    />
                  )}
                  {question.type === "shortAnswer" && (
                    <TextField fullWidth variant="outlined" disabled />
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </div>
    </ProtectedRoute>
  );
}
