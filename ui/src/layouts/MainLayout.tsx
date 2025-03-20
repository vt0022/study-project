import Leftbar from "@/components/layout/Leftbar";
import Rightbar from "@/components/layout/Rightbar";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <Box sx={{ display: "flex", width: "100vw", backgroundColor: "#f0f0f0" }}>
      <Leftbar />
      <Outlet />
      <Rightbar />
    </Box>
  );
}

export default MainLayout;
