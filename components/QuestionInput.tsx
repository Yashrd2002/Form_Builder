import React from "react";
import {
  TextField,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

interface QuestionInputProps {
  question: Question;
  updateQuestionText: (id: string, text: string) => void;
  updateQuestionOptions: (id: string, options: string[]) => void;
  toggleFileType: (id: string, fileType: string) => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  question,
  updateQuestionText,
  updateQuestionOptions,
  toggleFileType,
}) => {
  switch (question.type) {
    case "text":
    case "shortAnswer":
    case "email":
      return (
        <TextField
          fullWidth
          label={question.questionText || "Question"}
          value={question.questionText}
          onChange={(e) => updateQuestionText(question.id, e.target.value)}
          sx={{ mt: 1 }}
          type={question.type === "email" ? "email" : "text"}
        />
      );
    case "multipleChoice":
      return (
        <Box>
          <TextField
            fullWidth
            label="Question"
            value={question.questionText}
            onChange={(e) => updateQuestionText(question.id, e.target.value)}
            sx={{ mt: 1 }}
          />
          {question.options?.map((option, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...question.options!];
                newOptions[index] = e.target.value;
                updateQuestionOptions(question.id, newOptions);
              }}
              sx={{ mt: 1 }}
            />
          ))}
          <Button
            variant="outlined"
            onClick={() => {
              const newOptions = [...question.options!, ""];
              updateQuestionOptions(question.id, newOptions);
            }}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>
        </Box>
      );
    case "fileUpload":
      return (
        <Box>
          <TextField
            fullWidth
            label="Question"
            value={question.questionText}
            onChange={(e) => updateQuestionText(question.id, e.target.value)}
            sx={{ mt: 1 }}
          />
          <Box sx={{ mt: 1 }}>
            {["pdf", "image", "document"].map((fileType) => (
              <FormControlLabel
                key={fileType}
                control={
                  <Checkbox
                    checked={question.fileTypes?.includes(fileType)}
                    onChange={() => toggleFileType(question.id, fileType)}
                  />
                }
                label={fileType.charAt(0).toUpperCase() + fileType.slice(1)}
              />
            ))}
          </Box>
        </Box>
      );
    case "checkbox":
      return (
        <Box>
          <TextField
            fullWidth
            label="Question"
            value={question.questionText}
            onChange={(e) => updateQuestionText(question.id, e.target.value)}
            sx={{ mt: 1 }}
          />
          {question.options?.map((option, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox disabled />
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...question.options!];
                  newOptions[index] = e.target.value;
                  updateQuestionOptions(question.id, newOptions);
                }}
                sx={{ mt: 1 }}
              />
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={() => {
              const newOptions = [...question.options!, ""];
              updateQuestionOptions(question.id, newOptions);
            }}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>
        </Box>
      );
    default:
      return null;
  }
};

export default QuestionInput;