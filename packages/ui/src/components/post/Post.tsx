import postService from "@/services/postService";
import { Edit, MoreVert } from "@mui/icons-material";
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
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import EditSection from "./EditSection";
import InteractiveBar from "./InteractiveBar";

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
  index?: number;
  setSize?: (index: number, height: number) => void;
  windowWidth?: number;
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
  index,
  setSize,
  windowWidth,
}: PostProps) {
  const [likeProps, setLikeProps] = useState({
    isLiked: isLiked,
    totalLikes: totalLikes,
  });

  const [openPreview, setOpenPreview] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const postRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSize?.(index, postRef.current.getBoundingClientRect().height);
  }, [setSize, index, windowWidth]);

  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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
      toast.error("Error like this post");
      console.log("Like failed: ", error);
    },
  });

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
    <Box sx={{ paddingBottom: "10px", backgroundColor: "#f0f0f0" }}>
      <Box sx={{ backgroundColor: "white", padding: "20px" }} ref={postRef}>
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
                      <MenuItem
                        onClick={() => {
                          setOpenEdit(true);
                          handleCloseMenu();
                        }}
                        disableRipple
                      >
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

            <InteractiveBar
              isLiked={likeProps.isLiked}
              totalLikes={likeProps.totalLikes}
              totalComments={totalComments}
              onLike={onLike}
            />
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
          open={openEdit}
          maxWidth="sm"
          fullWidth={true}
          onClose={() => setOpenEdit(false)}
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
              onClose={() => setOpenEdit(false)}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Post;
