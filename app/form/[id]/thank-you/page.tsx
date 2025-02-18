import { Container, Typography, Button } from "@mui/material";

export default function ThankYouPage() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Thank You!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Your response has been recorded.
      </Typography>
    </Container>
  );
}
