import Post from "@/components/post/Post";
import { usePrivateAxios } from "@/hooks/usePrivateAxios";
import { Image, ImageOutlined } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Avatar, Box, Button, Grid2, IconButton, Stack, TextField, Typography } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

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
            }}>
            <Box sx={{ backgroundColor: "white", padding: "20px" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Home
                </Typography>
            </Box>

            <Box sx={{ backgroundColor: "white", p: "20px" }}>
                <Grid2 container spacing={3}>
                    <Grid2>
                        <Avatar alt="My avatar" sx={{ width: "50px", height: "50px" }}>
                            Me
                        </Avatar>
                    </Grid2>

                    <Grid2 size="grow">
                        <Stack spacing={2}>
                            <TextField
                                id="standard-multiline-flexible"
                                label="What is on your mind?"
                                multiline
                                maxRows={10}
                                variant="standard"
                                fullWidth
                                slotProps={{
                                    input: { sx: { fontSize: "25px" } }, // ✅ Tăng cỡ chữ input
                                    inputLabel: { sx: { fontSize: "20px" } }, // ✅ Tăng cỡ chữ label
                                }}
                            />

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <IconButton aria-label="Upload image" color="primary" component="label">
                                    <ImageOutlined />
                                    <VisuallyHiddenInput type="file" onChange={(event) => console.log(event.target.files)} />
                                </IconButton>

                                <Button variant="contained" sx={{ borderRadius: "1000px" }}>
                                    Post
                                </Button>
                            </Box>
                        </Stack>
                    </Grid2>
                </Grid2>
            </Box>

            <Box sx={{ backgroundColor: "white", padding: "20px" }}>
                <Post />
            </Box>
        </Stack>
    );
}

export default Home;
