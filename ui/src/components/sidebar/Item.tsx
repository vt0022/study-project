import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ComponentType } from "react";
import { useLocation } from "react-router-dom";

interface ItemProps {
  icon: ComponentType;
  name: string;
  path: string;
}
function Item({ icon: Icon, name, path }: ItemProps) {
  const location = useLocation();

  return (
    <ListItemButton selected={path === location.pathname}>
      <ListItemIcon>
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
