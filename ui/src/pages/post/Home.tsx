import Post from "@/components/post/Post";
import { usePrivateAxios } from "@/hooks/usePrivateAxios";
import { ImageOutlined } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Grid2,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import PreviewImage from "@/components/post/PreviewImage";
import Image from "@/assets/images/test.jpg";

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

  const { control, resetField, handleSubmit, watch } = useForm();

  const imageRef = useRef(null);

  const [preview, setPreview] = useState<string>();

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const urlImage = URL.createObjectURL(file);
    setPreview(urlImage);
  };

  const onRemovePreview = () => {
    setPreview("");
    resetField("image");
    imageRef.current.value = null; // Reset file input
  };

  const onSubmit = (data) => {
    console.log(data);
  };

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

      <Box sx={{ backgroundColor: "white", p: "20px" }}>
        <Grid2 container spacing={3}>
          <Grid2>
            <Avatar alt="My avatar" sx={{ width: "50px", height: "50px" }}>
              Me
            </Avatar>
          </Grid2>

          <Grid2 size="grow">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Controller
                  name="content"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="What is on your mind?"
                      multiline
                      maxRows={10}
                      variant="standard"
                      fullWidth
                      slotProps={{
                        input: { sx: { fontSize: "25px" } },
                        inputLabel: { sx: { fontSize: "20px" } },
                      }}
                    />
                  )}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <IconButton
                    aria-label="Upload image"
                    color="primary"
                    component="label"
                  >
                    <ImageOutlined />

                    <Controller
                      name="image"
                      control={control}
                      render={({ field: { value, onChange, ...field } }) => (
                        <VisuallyHiddenInput
                          {...field}
                          type="file"
                          // File input is uncontrolled so must set name to it
                          value={value?.fileName}
                          onChange={(e) => {
                            // Transfer file into controller
                            onChange(e.target.files[0]);
                            handleUploadImage(e);
                          }}
                          ref={imageRef}
                        />
                      )}
                    />
                  </IconButton>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: "1000px" }}
                    type="submit"
                    disabled={!watch("content") && !preview}
                  >
                    Post
                  </Button>
                </Box>

                <PreviewImage preview={preview} onRemove={onRemovePreview} />
              </Stack>
            </form>
          </Grid2>
        </Grid2>
      </Box>

      <Box sx={{ backgroundColor: "white", padding: "20px" }}>
        <Post
          firstName="Thuan"
          lastName="Nguyen"
          avatar={Image}
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi."
          date={new Date("2025-03-18")}
          image={Image}
          totalLikes={10}
          totalComments={5}
          isLiked={true}
        />
      </Box>
    </Stack>
  );
}

export default Home;
