import { Clear } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

interface PreviewImageProps {
  preview?: string;
  onRemove?: () => void;
}

function PreviewImage({ preview, onRemove }: PreviewImageProps) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        width: "fit-content",
      }}
    >
      {preview ? (
        <img
          src={preview}
          style={{
            borderRadius: "20px",
            width: "400px",
            height: "300px",
            objectFit: "cover",
          }}
        />
      ) : null}

      {preview ? (
        <IconButton
          aria-label="Remove image"
          color="info"
          sx={{
            position: "absolute",
            right: "10px",
            top: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
          }}
          onClick={onRemove}
        >
          <Clear />
        </IconButton>
      ) : null}
    </Box>
  );
}

export default PreviewImage;
