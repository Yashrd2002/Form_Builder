import { Typography, Box } from "@mui/material";

export default function FormResponses({ responses }: { responses: any[] }) {
  return (
    <Box>
      {responses.map((response, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography variant="h6">Response {index + 1}</Typography>
          <pre>{JSON.stringify(response.responses, null, 2)}</pre>
        </Box>
      ))}
    </Box>
  );
}