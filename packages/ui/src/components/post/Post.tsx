import postService from "@/services/postService";
import { toastOptions } from "@/utils/toastOptions";
import {
  ChatBubbleOutline,
  Edit,
  Favorite,
  FavoriteBorderOutlined,
  MoreVert,
  Share,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  Grid2,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { toast } from "react-toastify";
import UploadSection from "./UploadSection";
import EditSection from "./EditSection";

type PostProps = {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
  content: string;
  imageUrl: string;
  thumbnailUrl: string;
  date: Date;
  isPrivate: boolean;
  totalLikes: number;
  totalComments: number;
  isLiked: boolean;
  isMine?: boolean;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "rgba(0, 0, 0, 0.7)",
  boxShadow: 24,
  border: "0",
};

function Post({
  id,
  firstName,
  lastName,
  avatar,
  content,
  imageUrl,
  thumbnailUrl,
  date,
  isPrivate,
  totalLikes,
  totalComments,
  isLiked,
  isMine,
}: PostProps) {
  const [openPreview, setOpenPreview] = useState(false);
  const [openEdit, setOpenEdit] = useState(true);
  const [likeProps, setLikeProps] = useState({
    isLiked: isLiked,
    totalLikes: totalLikes,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = Boolean(anchorEl);

  const mutation = useMutation({
    mutationFn: (postId) => postService.likePost(postId),
    onSuccess: (response) => {
      if (response.statusCode !== 200) {
        setLikeProps((prevLikeProps) => ({
          ...likeProps,
          isLiked: !prevLikeProps.isLiked,
          totalLikes: prevLikeProps.isLiked
            ? prevLikeProps.totalLikes - 1
            : prevLikeProps.totalLikes + 1,
        }));
      }
    },
    onError: (error) => {
      toast.error("Error like this post", toastOptions);
      console.log("Like failed: ", error);
    },
  });

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const onLike = () => {
    setLikeProps((prevLikeProps) => ({
      ...prevLikeProps,
      isLiked: !prevLikeProps.isLiked,
      totalLikes: prevLikeProps.isLiked
        ? prevLikeProps.totalLikes - 1
        : prevLikeProps.totalLikes + 1,
    }));
    mutation.mutate(id);
  };

  return (
    <Box
      sx={{ backgroundColor: "white", marginBottom: "10px", padding: "20px" }}
    >
      <Grid2 container spacing={3}>
        <Grid2>
          <Avatar
            alt="Other avatar"
            sx={{ width: "50px", height: "50px", margin: "0 auto" }}
            src={avatar}
          >
            {firstName.charAt(0).toUpperCase()}
          </Avatar>
        </Grid2>

        <Grid2 size="grow">
          <Stack spacing={1}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "flex-end" }}
            >
              <Stack
                direction="row"
                sx={{ alignItems: "flex-end" }}
                spacing={1}
              >
                <Typography sx={{ fontWeight: "500", textAlign: "justify" }}>
                  {lastName} {firstName}
                </Typography>

                <Typography>•</Typography>

                <Typography sx={{ textAlign: "justify", color: "gray" }}>
                  {moment(date).fromNow()}
                </Typography>
              </Stack>

              {isMine && (
                <div>
                  <IconButton
                    aria-label="more"
                    id="menu-button"
                    onClick={handleClickMenu}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    id="action-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    slotProps={{
                      paper: {
                        sx: {
                          "& .MuiMenuItem-root": {
                            "& .MuiSvgIcon-root": {
                              fontSize: 18,
                              color: "gray",
                              marginRight: "10px",
                            },
                            "&:active": {
                              backgroundColor: "gray",
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem onClick={handleCloseMenu} disableRipple>
                      <Edit />
                      Edit
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </Stack>

            <Typography
              variant="body1"
              sx={{
                textAlign: "justify",
                maxWidth: "580px",
              }}
            >
              {content}
            </Typography>

            <img
              src={thumbnailUrl ? thumbnailUrl : imageUrl}
              style={{
                borderRadius: "20px",
                maxWidth: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => setOpenPreview(true)}
            />
          </Stack>

          <Grid2 container display="flex" spacing={2} marginTop={1}>
            <Stack direction="row" alignItems="center">
              <IconButton
                color={likeProps.isLiked ? "error" : "default"}
                onClick={onLike}
                sx={{
                  transition: "color 0.3s ease-in-out, transform 0.2s",
                  "&:active": { transform: "scale(0.9)" },
                }}
              >
                {likeProps.isLiked ? <Favorite /> : <FavoriteBorderOutlined />}
              </IconButton>

              <Typography fontSize="20px">{likeProps.totalLikes}</Typography>
            </Stack>

            <Stack direction="row" alignItems="center">
              <IconButton>
                <ChatBubbleOutline />
              </IconButton>

              <Typography fontSize="20px">{totalComments}</Typography>
            </Stack>

            <IconButton>
              <Share />
            </IconButton>
          </Grid2>
        </Grid2>
      </Grid2>

      <Modal open={openPreview} onClose={() => setOpenPreview(false)}>
        <Fade in={openPreview}>
          <div style={style}>
            <img src={imageUrl} style={{ maxHeight: "90vh" }} />
          </div>
        </Fade>
      </Modal>

      <Dialog
        open={true}
        maxWidth="sm"
        fullWidth={true}
        onClose={handleCloseEdit}
      >
        <DialogTitle sx={{ marginBottom: "10px", fontSize: "30px" }}>
          Edit post
        </DialogTitle>
        <DialogContent>
          <EditSection
            from="wall"
            id={id}
            content={content}
            isPrivate={isPrivate}
            imageUrl={imageUrl}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Post;
