import { Typography, TextField, Box, Checkbox, FormControlLabel } from "@mui/material";

export default function FormPreview({ form }: { form: any }) {
  return (
    <Box>
      {form.questions.map((question: any, index: number) => (
        <Box key={question.id} sx={{ mb: 3 }}>
          <Typography variant="h6">
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
        </Box>
      ))}
    </Box>
  );
}