import Sidebar from "@/components/shared/Sidebar";
import Home from "@/pages/post/Home";
import { Box, Stack } from "@mui/material";

function MainLayout() {
  return (
      <Box sx={{ display: "flex", width: "100vw", backgroundColor: "#f0f0f0" }}>
          <Sidebar />
          <Home />
      </Box>
  );
}

export default MainLayout;
