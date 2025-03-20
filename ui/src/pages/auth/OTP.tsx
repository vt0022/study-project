import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Logo from "@/assets/images/verify.png";
import { Controller, useForm } from "react-hook-form";
import authService from "@/services/authService";
import { useLocation, useNavigate } from "react-router-dom";

function OTP() {
  // TODO: Use isSubmitting
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [timeLeft, setTimeLeft] = useState(15 * 60 - 1);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [openNoti, setOpenNoti] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.floor((now - lastUpdate) / 1000);
      setTimeLeft((prev) => Math.max(0, prev - diff));
      setLastUpdate(now);
    };

    const interval = setInterval(updateTimer, 1000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lastUpdate]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const onSubmit = async (data) => {
    const response = await authService.verify(email, data.code);
    if (response.statusCode !== 200) {
      setOpenNoti(true);
      setMessage(response.message);
    } else {
      navigate("/");
    }
  };

  const onCloseSnackbar = () => {
    setOpenNoti(false);
  };

  return (
    <>
      <Container>
        <Box
          sx={{
            width: "400px",
            height: "fit-content",
            borderRadius: 5,
            boxShadow: 3,
            padding: 5,
          }}
        >
          <Avatar
            alt="Verify logo"
            variant="square"
            src={Logo}
            sx={{ width: 100, height: 100, mx: "auto" }}
          />

          <Typography variant="h4" sx={{ mb: 2, mt: 2, fontWeight: 500 }}>
            Enter OTP code
          </Typography>

          <Typography sx={{ mb: 8, fontWeight: 500 }}>
            We've sent an OTP code to your email. Please check and enter to
            verify your account.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
              <Controller
                name="code"
                control={control}
                defaultValue=""
                rules={{
                  required: "Please enter the OTP code",
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    variant="standard"
                    inputProps={{
                      maxLength: 6,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      sx: {
                        textAlign: "center",
                        fontSize: 30,
                        fontWeight: 500,
                        "&::placeholder": {
                          textAlign: "center",
                        },
                      },
                    }}
                    error={!!fieldState.error}
                  />
                )}
              />

              <Typography variant="body1" sx={{ color: "green" }}>
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </Typography>

              <Button
                variant="contained"
                size="large"
                loading={isSubmitting}
                type="submit"
              >
                Verify
              </Button>
            </Stack>
          </form>
        </Box>

        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={openNoti}
          autoHideDuration={2000}
          onClose={onCloseSnackbar}
        >
          <Alert
            onClose={onCloseSnackbar}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default OTP;
