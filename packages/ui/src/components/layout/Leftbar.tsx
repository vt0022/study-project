import { usePrivateAxios } from "@/hooks/usePrivateAxios";
import { removeUser } from "@/redux/slices/userSlice";
import authService from "@/services/authService";
import { BubbleChart, ExitToApp } from "@mui/icons-material";
import { Box, IconButton, List, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Item from "../sidebar/Item";
import { LeftbarItemList } from "../sidebar/ItemList";

function Leftbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  usePrivateAxios();

  const onLogout = async () => {
    await authService.logout();
    dispatch(removeUser());
    navigate("/login");
  };

  return (
    <Box sx={{ height: "100vh", boxSizing: "border-box" }}>
      <Box
        sx={{
          width: "300px",
          p: "50px",
          position: "fixed",
          backgroundColor: "white",
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", marginY: "50px" }}>
          <BubbleChart
            color="success"
            sx={{ width: 70, height: 70, marginRight: "10px" }}
          />

          <Typography variant="h4" color="info" sx={{ fontWeight: "bold" }}>
            Sociala
          </Typography>
        </Box>

        <List>
          {LeftbarItemList.map((item, key) => {
            return (
              <Item
                key={key}
                name={item.name}
                icon={item.icon}
                isSelected={item.path === location.pathname}
                onClick={() => navigate(item.path)}
              />
            );
          })}
        </List>

        <IconButton color="info" onClick={onLogout}>
          <ExitToApp />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Leftbar;
