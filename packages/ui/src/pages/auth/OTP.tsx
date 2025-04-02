import Logo from "@/assets/images/verify.png";
import { storeUser } from "@/redux/slices/userSlice";
import authService from "@/services/authService";
import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

function OTP() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email;

  const [timeLeft, setTimeLeft] = useState(15 * 60 - 1);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

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
      toast.error(response.message);
    } else {
      toast.success("You are now logging in");
      // Get user data from response
      const user: User = response.data.user;
      // Store and persist user data
      dispatch(storeUser(user));
      navigate("/home");
    }
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
            backgroundColor: "white",
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
      </Container>
    </>
  );
}

export default OTP;
