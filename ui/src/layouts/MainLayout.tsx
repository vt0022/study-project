import Leftbar from "@/components/layout/Leftbar";
import Rightbar from "@/components/layout/Rightbar";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <Box sx={{ width: "100vw", backgroundColor: "#f0f0f0", padding: '10px'}}>
      <Box sx={{ display: "flex", width: {md: "100vw", xl: '80vw'}, backgroundColor: "#f0f0f0", margin:'auto' }}>
        <Leftbar />
        <Outlet />
        <Rightbar />
      </Box>
    </Box>
  );
}

export default MainLayout;
