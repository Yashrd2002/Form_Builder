import { supabase } from "@/lib/supabaseClient";
import { Box, Divider, Drawer, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import CreateIcon from "@mui/icons-material/Create";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Sidebar = () => {
  const router = useRouter();
  return (
    <Drawer
      variant="permanent"
      className="w-64"
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1F2937",
          color: "white",
          padding: "16px 0",
        },
      }}
    >
      <Box className="flex flex-col h-full p-4">
        <Typography
          variant="h6"
          className="mb-6 text-white font-semibold text-xl"
        >
          Form Builder
        </Typography>
        <Divider className="bg-gray-700 mb-6" />
        <Box className="flex flex-col space-y-4">
          <Box
            onClick={() => router.push("/dashboard")}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            <HomeIcon className="text-white text-lg" />
            <Typography className="text-white font-medium">
              Dashboard
            </Typography>
          </Box>
          <Box
            onClick={() => router.push("/builder")}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            <CreateIcon className="text-white text-lg" />
            <Typography className="text-white font-medium">
              Create Form
            </Typography>
          </Box>
        </Box>
        <Divider className="bg-gray-700 my-6" />
        <Box
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/auth/signin");
          }}
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer mt-auto"
        >
          <ExitToAppIcon className="text-white text-lg" />
          <Typography className="text-white font-medium">Sign Out</Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
