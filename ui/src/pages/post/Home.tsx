import Post from "@/components/post/Post";
import { usePrivateAxios } from "@/hooks/usePrivateAxios";
import { Avatar, Box, Stack, TextField, Typography } from "@mui/material";

function Home() {
  usePrivateAxios();

  return (
    <Stack
      spacing="10px"
      sx={{
        backgroundColor: "#f0f0f0",
        marginLeft: "400px",
        flexGrow: 1,
        paddingX: "10px",
      }}
    >
      <Box sx={{ backgroundColor: "white", padding: "20px" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Home
        </Typography>
      </Box>

      <Box sx={{ backgroundColor: "white", p: "10px" }}>
        <Stack direction="row" sx={{ margin: "20px" }} spacing={5}>
          <Avatar alt="My avatar" sx={{ width: "50px", height: "50px" }}>
            Me
          </Avatar>

          <TextField
            id="standard-multiline-flexible"
            label="What is on your mind?"
            multiline
            maxRows={10}
            variant="standard"
            fullWidth
          />
        </Stack>
      </Box>

      <Box sx={{ backgroundColor: "white", padding: "10px" }}>
        <Post />
      </Box>
    </Stack>
  );
}

export default Home;
