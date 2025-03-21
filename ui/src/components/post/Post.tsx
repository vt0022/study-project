import {
  Avatar,
  Box,
  Fade,
  Grid2,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import Image from "@/assets/images/test.jpg";
import { ChatBubble, Favorite, Share, Visibility } from "@mui/icons-material";

type PostProps = {
  firstName: string;
  lastName: string;
  avatar: string;
  content: string;
  image: string;
  date: Date;
  totalLikes: number;
  totalComments: number;
  isLiked: boolean;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  border: "0"
};

function Post({
  firstName,
  lastName,
  avatar,
  content,
  image,
  date,
  totalLikes,
  totalComments,
  isLiked,
}: PostProps) {
  return (
    <Box>
      <Grid2 container spacing={3}>
        <Grid2>
          <Avatar
            alt="Other avatar"
            sx={{ width: "50px", height: "50px", margin: "0 auto" }}
            src={avatar}
          >
            Anna
          </Avatar>
        </Grid2>

        <Grid2 size="grow">
          <Stack spacing={1}>
            <Stack direction="row" sx={{ alignItems: "flex-end" }} spacing={1}>
              <Typography sx={{ fontWeight: "500", textAlign: "justify" }}>
                {firstName} {lastName}
              </Typography>

              <Typography>•</Typography>

              <Typography sx={{ textAlign: "justify", color: "gray" }}>
                {moment().calendar(date)}
              </Typography>
            </Stack>

            <Typography variant="body1" sx={{ textAlign: "justify" }}>
              {content}
            </Typography>

            <img
              src={image}
              style={{
                borderRadius: "20px",
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
          </Stack>

          <Grid2 display="flex" justifyContent="space-between" marginTop={1}>
            <Stack direction="row" alignItems="center">
              <IconButton color={isLiked ? "error" : "default"}>
                <Favorite />
              </IconButton>

              <Typography fontSize="20px">{totalLikes}</Typography>
            </Stack>

            <IconButton>
              <ChatBubble />
            </IconButton>

            <IconButton>
              <Share />
            </IconButton>
          </Grid2>
        </Grid2>
      </Grid2>
{/* 
      <Modal open={true} slotProps={{}}>
        <Fade in={o}
        <Box sx={style}>
          <img src={Image} />
        </Box>
      </Modal> */}
    </Box>
  );
}

export default Post;
