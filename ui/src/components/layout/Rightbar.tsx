import { Box } from "@mui/material";

function Rightbar() {
  return (
    <Box
      sx={{
        width: "400px",
        backgroundColor: "white",
        position: "sticky",
        top: "10px",
        zIndex: "1000",
      }}
    ></Box>
  );
}
export default Rightbar;
