import { Box, List } from "@mui/material";
import Logo from "@/assets/images/logo.webp";
import { LeftbarItemList } from "../sidebar/ItemList";
import Item from "../sidebar/Item";

function Leftbar() {
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
        <img
          src={Logo}
          alt="Logo"
          width="100"
          height="100"
          style={{ margin: "0 auto" }}
        />

        <List>
          {LeftbarItemList.map((item, key) => {
            return (
              <Item
                key={key}
                name={item.name}
                icon={item.icon}
                path={item.path}
              />
            );
          })}
        </List>
      </Box>
    </Box>
  );
}

export default Leftbar;
