import { Avatar, Box, Grid2 } from "@mui/material";

function Post() {
  return (<Box>
    <Grid2 container>
      <Grid2 size={2}>
        <Avatar alt="Other avatar" sx={{ width: "50px", height: "50px", margin:'0 auto' }}>Anna</Avatar>
      </Grid2>

      <Grid2 size={10}>
        <h1>Body</h1>
      </Grid2>
    </Grid2>
    
  </Box>);
}

export default Post;
