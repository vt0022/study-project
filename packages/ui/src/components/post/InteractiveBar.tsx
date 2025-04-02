import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorderOutlined,
  Share,
} from "@mui/icons-material";
import { Grid2, IconButton, Stack, Typography } from "@mui/material";

interface InteractiveBarProps {
  isLiked: boolean;
  totalLikes: number;
  totalComments: number;
  onLike: () => void;
}

function InteractiveBar({
  isLiked,
  totalLikes,
  totalComments,
  onLike,
}: InteractiveBarProps) {
  return (
    <Grid2 container display="flex" spacing={2} marginTop={1}>
      <Stack direction="row" alignItems="center">
        <IconButton
          color={isLiked ? "error" : "default"}
          onClick={onLike}
          sx={{
            transition: "color 0.3s ease-in-out, transform 0.2s",
            "&:active": { transform: "scale(0.9)" },
          }}
        >
          {isLiked ? <Favorite /> : <FavoriteBorderOutlined />}
        </IconButton>

        <Typography fontSize="20px">{totalLikes}</Typography>
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
  );
}

export default InteractiveBar;
