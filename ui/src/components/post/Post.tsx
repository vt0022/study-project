import { Avatar, Box, Grid2, Stack, Typography } from "@mui/material";

function Post() {
    return (
        <Box>
            <Grid2 container spacing={3}>
                <Grid2>
                    <Avatar alt="Other avatar" sx={{ width: "50px", height: "50px", margin: "0 auto" }}>
                        Anna
                    </Avatar>
                </Grid2>

                <Grid2 size="grow">
                    <Stack spacing={1}>
                        <Typography sx={{ fontWeight: "bold", textAlign: "justify" }}>10/12/2002 16:10</Typography>
                        <Typography variant="body1" sx={{ textAlign: "justify" }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
                        </Typography>
                    </Stack>
                </Grid2>
            </Grid2>
        </Box>
    );
}

export default Post;
