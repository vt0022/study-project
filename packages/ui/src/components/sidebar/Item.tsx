import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ComponentType } from "react";

interface ItemProps {
  icon: ComponentType;
  name: string;
  isSelected: boolean
  onClick: () => void
}
function Item({ icon: Icon, name, isSelected, onClick }: ItemProps) {
  return (
    <ListItemButton
    onClick={onClick}
      selected={isSelected}
      sx={{
        color: isSelected ? "black" : "gray",
        borderRadius: "10px",
      }}
    >
      <ListItemIcon
        sx={{
          color: isSelected ? "black" : "gray",
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
