"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
} from "@mui/material";
import { useParams } from "next/navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Sidebar from "@/components/Sidebar";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function FormResponsesPage() {
  const { id } = useParams();
  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch form details
      const { data: formData, error: formError } = await supabase
        .from("forms")
        .select("*")
        .eq("id", id)
        .single();

      if (formError) {
        console.error("Error fetching form:", formError.message);
      } else {
        setForm(formData);
      }

      // Fetch responses
      const { data: responseData, error: responseError } = await supabase
        .from("responses")
        .select("*")
        .eq("form_id", id);

      if (responseError) {
        console.error("Error fetching responses:", responseError.message);
      } else {
        setResponses(responseData);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  const exportToExcel = () => {
    // Step 1: Extract all unique questions from the responses
    const questions = Array.from(
      new Set(
        responses.flatMap((response) =>
          form.questions.map((question) => question.questionText)
        )
      )
    );

    // Step 2: Prepare the worksheet data, including headers and answers
    const worksheetData = [];

    // Add the headers (questions) to the first row
    worksheetData.push(questions);

    // Add answers for each response
    responses.forEach((response) => {
      const answers = questions.map((question) => {
        const questionId = form.questions.find(
          (q) => q.questionText === question
        )?.id;
        const answer = response.responses[questionId];

        if (Array.isArray(answer)) {
          return answer.join(", "); // Join array answers with commas
        } else if (typeof answer === "object") {
          return JSON.stringify(answer); // Convert objects to string
        } else {
          return answer || ""; // Default to empty string if no answer
        }
      });
      worksheetData.push(answers); // Add answers as a new row
    });

    // Step 3: Convert the data to a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Step 4: Create the workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

    // Step 5: Write the workbook to an Excel file and trigger download
    const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelFile]), "form_responses.xlsx");
  };

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
            Responses for "{form.title}"
          </Typography>
          <Typography variant="body1" gutterBottom>
            {form.description}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={exportToExcel}>
              Export to Excel
            </Button>
            <Box sx={{ mt: 3 }}>
              {responses.map((response, index) => {
                return (
                  <Card key={response.id} sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Response #{index + 1}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Submitted on:{" "}
                        {new Date(response.created_at).toLocaleString()}
                      </Typography>

                      <Divider sx={{ my: 2 }} />
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography variant="subtitle1">
                            View Response Details
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List>
                            {form.questions.map((question: any) => (
                              <Box key={question.id}>
                                <ListItem>
                                  <ListItemText
                                    primary={question.questionText}
                                    secondary={
                                      Array.isArray(
                                        response.responses[question.id]
                                      )
                                        ? response.responses[question.id].join(
                                            ", "
                                          )
                                        : typeof response.responses[
                                            question.id
                                          ] === "object"
                                        ? JSON.stringify(
                                            response.responses[question.id]
                                          )
                                        : response.responses[question.id]
                                    }
                                  />
                                </ListItem>
                                <Divider />
                              </Box>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        </Container>
      </div>
    </ProtectedRoute>
  );
}
