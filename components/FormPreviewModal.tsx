import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  formTitle: string;
  formDescription: string;
  questions: any;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  open,
  onClose,
  formTitle,
  formDescription,
  questions,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {formTitle}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {formDescription}
        </Typography>
        <Divider sx={{ my: 2 }} />
        {questions.map((question:any, index:any) => (
          <Box key={question.id} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {question.questionText || `Question ${index + 1}`}
              {question.required && (
                <span style={{ color: "red", marginLeft: "4px" }}>*</span>
              )}
            </Typography>
            {renderQuestionInput(question)}
          </Box>
        ))}
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Close Preview
        </Button>
      </Box>
    </Modal>
  );
};

const renderQuestionInput = (question: any) => {
  switch (question.type) {
    case "text":
    case "shortAnswer":
    case "email":
      return (
        <TextField
          fullWidth
          label={question.questionText || "Question"}
          variant="outlined"
          type={question.type === "email" ? "email" : "text"}
          required={question.required}
        />
      );
    case "multipleChoice":
      return (
        <Box>
          {question.options?.map((option:any, index:any) => (
            <FormControlLabel
              key={index}
              control={<Checkbox />}
              label={option}
            />
          ))}
        </Box>
      );
    case "fileUpload":
      return (
        <Box>
          <Button variant="outlined" component="label">
            Upload File
            <input type="file" hidden />
          </Button>
          <Typography variant="caption" sx={{ mt: 1 }}>
            Allowed file types: {question.fileTypes?.join(", ")}
          </Typography>
        </Box>
      );
    case "checkbox":
      return (
        <Box>
          {question.options?.map((option:any, index:any) => (
            <FormControlLabel
              key={index}
              control={<Checkbox />}
              label={option}
            />
          ))}
        </Box>
      );
    default:
      return null;
  }
};

export default PreviewModal;