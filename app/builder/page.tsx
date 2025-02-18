"use client";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
  Stack,
} from "@mui/material";
import DifferenceIcon from "@mui/icons-material/Difference";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PreviewIcon from "@mui/icons-material/Preview";
import { supabase } from "@/lib/supabaseClient";
import QuestionInput from "@/components/QuestionInput";
import Link from "next/link";
import PreviewModal from "@/components/FormPreviewModal";
import { useMutation } from "@tanstack/react-query";
import { FormData, saveForm } from "@/lib/supabaseApi";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
interface Question {
  id: string;
  type:
    | "text"
    | "multipleChoice"
    | "fileUpload"
    | "checkbox"
    | "shortAnswer"
    | "email";
  questionText: string;
  options?: string[];
  fileTypes?: string[];
  required?: boolean;
}

export default function FormBuilder() {
  const router = useRouter();
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "email",
      type: "text",
      questionText: "Email",
      required: true,
    },
  ]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);

  // Add this function to handle the preview button click
  const handlePreviewClick = () => {
    setPreviewOpen(true);
  };
  const addQuestion = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: `question-${questions.length + 1}`,
      type,
      questionText: "",
      options:
        type === "multipleChoice" || type === "checkbox" ? [""] : undefined,
      fileTypes: type === "fileUpload" ? [] : undefined,
      required: false,
    };
    setQuestions([...questions, newQuestion]);
    setSnackbarMessage("Question added successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    setSnackbarMessage("Question deleted successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find((q) => q.id === id);
    if (questionToDuplicate) {
      const duplicatedQuestion = {
        ...questionToDuplicate,
        id: `question-${questions.length + 1}`,
      };
      setQuestions([...questions, duplicatedQuestion]);
      setSnackbarMessage("Question duplicated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedQuestions = [...questions];
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);
    setQuestions(reorderedQuestions);
  };

  const updateQuestionText = (id: string, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, questionText: text } : q))
    );
  };

  const updateQuestionOptions = (id: string, options: string[]) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, options } : q)));
  };

  const toggleFileType = (id: string, fileType: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              fileTypes: q.fileTypes?.includes(fileType)
                ? q.fileTypes.filter((ft) => ft !== fileType)
                : [...(q.fileTypes || []), fileType],
            }
          : q
      )
    );
  };

  const toggleRequired = (id: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, required: !q.required } : q))
    );
  };

  const mutation = useMutation({
    mutationFn: (formData: FormData) => saveForm(formData),
    onSuccess: (data) => {
      console.log("Form saved successfully:", data);
      setSnackbarMessage("Form saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Error saving form:", error.message);
      setSnackbarMessage("Error saving form. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    },
  });

  const handleSubmit = () => {
    if (!formTitle || !formDescription) {
      setSnackbarMessage("Title and Description is Required");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    if (questions.length < 1) {
      setSnackbarMessage("Add Questions");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    mutation.mutate({
      title: formTitle,
      description: formDescription,
      questions,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-gray-50">
        {/* Sidebar for Add Field */}
        <Card sx={{ width: 280, p: 3, boxShadow: 3, borderRadius: 2 }}>
          {/* Title */}
          <Typography
            variant="h6"
            fontWeight={600}
            textAlign="center"
            gutterBottom
          >
            Add Field
          </Typography>

          {/* Buttons Group */}
          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addQuestion("text")}
            >
              Text
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addQuestion("multipleChoice")}
            >
              Multiple Choice
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addQuestion("fileUpload")}
            >
              File Upload
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addQuestion("checkbox")}
            >
              Checkbox
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addQuestion("shortAnswer")}
            >
              Short Answer
            </Button>
          </Stack>

          {/* Divider */}
          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handlePreviewClick}
              startIcon={<PreviewIcon />}
            >
              Preview Form
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              startIcon={<DataSaverOffIcon />}
            >
              Save Form
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<FastRewindIcon />}
            >
              <Link href={"/dashboard"}>GO Back</Link>
            </Button>
          </Stack>
        </Card>
        {/* Main Form Container */}
        <div className="w-full p-6 overflow-scroll flex justify-center">
          <div className="w-3/6">
            <Card sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom className="text-center">
                Form
              </Typography>
              <TextField
                fullWidth
                label="Form Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Form Description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                sx={{ mb: 3 }}
              />

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                      {questions.map((question, index) => (
                        <Draggable
                          key={question.id}
                          draggableId={question.id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ mb: 2 }}
                            >
                              <CardContent>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography variant="h6">
                                    {question.questionText ||
                                      `Question ${index + 1}`}
                                  </Typography>
                                  <Box>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={question.required}
                                          onChange={() =>
                                            toggleRequired(question.id)
                                          }
                                        />
                                      }
                                      label="Required"
                                    />
                                    <Tooltip title="Duplicate Question">
                                      <IconButton
                                        onClick={() =>
                                          duplicateQuestion(question.id)
                                        }
                                      >
                                        <DifferenceIcon />
                                      </IconButton>
                                    </Tooltip>
                                    {question.id !== "email" && (
                                      <Tooltip title="Delete Question">
                                        <IconButton
                                          onClick={() =>
                                            deleteQuestion(question.id)
                                          }
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </Box>

                                <QuestionInput
                                  question={question}
                                  updateQuestionText={updateQuestionText}
                                  updateQuestionOptions={updateQuestionOptions}
                                  toggleFileType={toggleFileType}
                                />
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            </Card>
          </div>
        </div>
        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <PreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          formTitle={formTitle}
          formDescription={formDescription}
          questions={questions}
        />
        ;
      </div>
    </ProtectedRoute>
  );
}
