import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ComponentType } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ItemProps {
  icon: ComponentType;
  name: string;
  path: string;
}
function Item({ icon: Icon, name, path }: ItemProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ListItemButton
      onClick={() => navigate(path)}
      selected={path === location.pathname}
      sx={{
        color: path === location.pathname ? "black" : "gray",
        borderRadius: "10px",
      }}
    >
      <ListItemIcon
        sx={{
          color: path === location.pathname ? "black" : "gray",
          borderRadius: "10px",
        }}
      >
        <Icon />
      </ListItemIcon>
      <ListItemText
        primary={name}
        slotProps={{ primary: { fontWeight: 500, fontSize: "20px" } }}
      />
    </ListItemButton>
  );
}

export default Item;
