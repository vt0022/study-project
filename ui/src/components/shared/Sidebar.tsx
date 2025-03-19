import { Home, Inbox, Newspaper, Notifications, People, Person, UsbOffRounded } from "@mui/icons-material";
import {
  Box,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Logo from "@/assets/images/logo.webp";

function Sidebar() {
  return (
    <Box sx={{ height: "100vh" }}>
      <Box
        sx={{
          width: 300,
          p: 2,
          position: "fixed",
        }}
      >
        <h1>Sidebar</h1>
        <img
          src={Logo}
          alt="Logo"
          width="100"
          height="100"
          style={{ margin: "0 auto" }}
        />

        <List>
          <ListItemButton selected={true}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText
              primary="Home"
              slotProps={{ primary: { fontWeight: 500 } }}
            />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText
              primary="Notifications"
              slotProps={{ primary: { fontWeight: 500 } }}
            />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText
              primary="Notifications"
              slotProps={{ primary: { fontWeight: 500 } }}
            />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
}

export default Sidebar;
