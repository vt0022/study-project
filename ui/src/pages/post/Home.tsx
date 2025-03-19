import { Avatar, Box, Container, Stack, TextField } from "@mui/material";

function Home() {
    return (
        <Stack spacing="10px" sx={{ backgroundColor: "#f0f0f0", marginLeft: "310px", flexGrow: 1, p: "10px" }}>
            <Box sx={{ borderRadius: "20px", backgroundColor: "white", p: "10px" }}>
                <h1>Post create</h1>
                <Stack direction="row" sx={{ margin: "20px" }} spacing={5}>
                    <Avatar alt="My avatar" sx={{ width: "50px", height: "50px" }}>
                        Me
                    </Avatar>

                    <TextField id="standard-multiline-flexible" label="What is on your mind?" multiline maxRows={10} variant="standard" fullWidth />
                </Stack>
            </Box>

            <Box sx={{ borderRadius: "20px", backgroundColor: "white" }}>
                <h1>Post list</h1>
            </Box>
        </Stack>
    );
}

export default Home;
