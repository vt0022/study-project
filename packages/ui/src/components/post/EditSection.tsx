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

interface EditSectionProps {
  from: string;
  id: number;
  isPrivate: boolean;
  imageUrl: string;
  content: string;
  onClose: () => void;
}

function EditSection({
  from = "",
  id,
  isPrivate,
  imageUrl,
  content,
  onClose,
}: EditSectionProps) {
  usePrivateAxios();

  const queryClient = useQueryClient();

  const { control, resetField, handleSubmit, watch, reset } = useForm();

  const imageRef = useRef(null);

  const [preview, setPreview] = useState(imageUrl || "");

  const mutation = useMutation({
    mutationFn: ({ postId, formData }) =>
      postService.updatePost(postId, formData),
    onSuccess: (response) => {
      if (response.statusCode === 200) {
        // toast.success("Your post is ready", toastOptions);
        reset();
        setPreview("");
        onClose();
        queryClient.setQueryData(["myPostList"], (oldData) => {
          if (!oldData) {
            return oldData;
          }
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                data: page?.data?.data.map((post) =>
                  post.id === response.data.id ? response.data : post
                ),
              },
            })),
          };
        });
      } else {
        toast.error("Error editting your post", toastOptions);
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
    formData.append("isPrivate", JSON.stringify(data.privacy));
    console.log(data);
    mutation.mutate({ postId: id, formData });
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
            defaultValue={isPrivate}
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
          defaultValue={content}
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
            Save
          </Button>
        </Box>

        <PreviewImage preview={preview} onRemove={onRemovePreview} />
      </Stack>
    </form>
  );
}

export default EditSection;
