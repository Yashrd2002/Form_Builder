"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Drawer,
  Divider,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BarChartIcon from "@mui/icons-material/BarChart";
import Sidebar from "@/components/Sidebar";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
export default function DashboardPage() {
  const [forms, setForms] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      const { data, error } = await supabase.from("forms").select("*");

      if (error) {
        console.error("Error fetching forms:", error.message);
      } else {
        setForms(data);
      }
    };

    fetchForms();
  }, []);

  const handleDeleteForm = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this form? This action cannot be undone."
    );

    if (!isConfirmed) {
      return; // User canceled the deletion
    }

    const { error } = await supabase.from("forms").delete().eq("id", id);

    if (error) {
      console.error("Error deleting form:", error.message);
    } else {
      setForms(forms.filter((form) => form.id !== id));
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Container maxWidth="lg" className="flex-grow p-8 overflow-y-auto">
          <Typography variant="h4" gutterBottom className="text-gray-800">
            Dashboard
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/builder")}
            className="mb-6 bg-blue-600 hover:bg-blue-700"
          >
            Create New Form
          </Button>
          <Box>
            {forms.map((form, i) => (
              <Card
                key={form.id}
                className="mb-4 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent>
                  <Typography variant="h6" className="text-gray-900">
                    {form.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {form.description}
                  </Typography>

                  {/* Link & Copy Section */}
                  <Box className="mt-4 flex items-center space-x-4">
                    {/* Label for Form Link */}
                    <Typography
                      variant="body1"
                      className="text-gray-800 font-semibold"
                    >
                      Form Link:
                    </Typography>

                    {/* Display the Form Link with Tooltip */}
                    <Tooltip title="Click to copy form link">
                      <Link
                        target="_blank"
                        className="text-blue-600 cursor-pointer hover:underline"
                        href={`${window.location.origin}/form/${form.id}`}
                      >
                        {`${window.location.origin}/form/${form.id}`}
                      </Link>
                    </Tooltip>

                    {/* Copy Icon Button */}
                    <IconButton
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/form/${form.id}`
                        )
                      }
                      title="Copy Form Link"
                      className="text-blue-500 hover:bg-blue-50"
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </Box>

                  {/* Action Buttons */}
                  <Box className="mt-4 flex space-x-2">
                    <IconButton
                      onClick={() => router.push(`/form/${form.id}/preview`)}
                      title="Preview Form"
                      className="text-blue-500 hover:bg-blue-50"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => router.push(`/edit/${form.id}`)}
                      title="Edit Form"
                      className="text-blue-500 hover:bg-blue-50"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => router.push(`/responses/${form.id}`)}
                      title="View Responses"
                      className="text-green-500 hover:bg-green-50"
                    >
                      <BarChartIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteForm(form.id)}
                      title="Delete Form"
                      className="text-red-500 hover:bg-red-50"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </div>
    </ProtectedRoute>
  );
}
