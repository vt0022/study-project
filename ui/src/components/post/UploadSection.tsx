import PreviewImage from "@/components/post/PreviewImage";
import { usePrivateAxios } from "@/hooks/usePrivateAxios";
import postService from "@/services/postService";
import { toastOptions } from "@/utils/toastOptions";
import {
  ImageOutlined,
  LockPersonOutlined,
  PublicOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

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

interface UploadSectionProps {
  from: string;
}

function UploadSection({ from = "" }: UploadSectionProps) {
  usePrivateAxios();

  const queryClient = useQueryClient();

  const { control, resetField, handleSubmit, watch, reset } = useForm();

  const imageRef = useRef(null);

  const [preview, setPreview] = useState("");

  const mutation = useMutation({
    mutationFn: (formData) => postService.createPost(formData),
    onSuccess: (response) => {
      if (response.statusCode === 200) {
        toast.success("Your post is ready", toastOptions);
        reset();
        setPreview("");
        if (from === "wall") {
          queryClient.invalidateQueries({
            queryKey: ["myPostList"],
            refetchType: "active",
          });
        }
      } else {
        toast.error("Error creating your post", toastOptions);
      }
    },
    onError: (error) => {
      toast.error("Error creating your post", toastOptions);
      console.log("Upload failed: ", error);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("file", data.image);
    formData.append("content", data.content);
    formData.append("privacy", JSON.stringify(data.isPrivate));
    mutation.mutate(formData);
  };

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ marginBottom: 2 }}>
        <FormControl size="small" sx={{ width: "fit-content" }}>
          <Controller
            name="privacy"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Select
                {...field}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {selected ? (
                      <LockPersonOutlined fontSize="small" />
                    ) : (
                      <PublicOutlined fontSize="small" />
                    )}
                    <Typography>{selected ? "Only me" : "Public"}</Typography>
                  </Box>
                )}
              >
                <MenuItem value={true}>
                  <ListItemIcon>
                    <LockPersonOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Only me" />
                </MenuItem>
                <MenuItem value={false}>
                  <ListItemIcon>
                    <PublicOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Public" />
                </MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Stack>

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
              defaultValue={null}
              render={({ field: { value, onChange, ...field } }) => (
                <VisuallyHiddenInput
                  {...field}
                  type="file"
                  accept="image/png, image/jpeg, image/bmp, image/webp, image/jpg"
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
            loading={mutation.isPending}
          >
            Post
          </Button>
        </Box>

        <PreviewImage preview={preview} onRemove={onRemovePreview} />
      </Stack>
    </form>
  );
}

export default UploadSection;
