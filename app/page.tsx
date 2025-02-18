"use client";

import { Button, Typography, Box, Container } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth/signin");
  };

  return (
    <Container className="flex justify-center items-center h-screen">
      <Box className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <Typography variant="h3" className="text-gray-800 font-semibold mb-4">
          Welcome to Form Builder
        </Typography>
        <Typography variant="h6" className="text-gray-600 mb-6">
          Easily create and manage your forms with our intuitive builder tool.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGetStarted}
          className="w-full py-2 text-white"
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
}
