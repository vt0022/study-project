import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Logo from "@/assets/images/login.png";
import AuthService from "@/services/authService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const { control, handleSubmit } = useForm();

  const [openNoti, setOpenNoti] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const response = await AuthService.login(data.email, data.password);
    if(response.statusCode !== 200) {
        setOpenNoti(true);
        setMessage(response.message);
    }
  };

  const onCloseSnackbar = () => {
    setOpenNoti(false);
  };

  const onClickShowPassword = () => setShowPassword((show) => !show);

  const onMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
            alt="Login logo"
            src={Logo}
            sx={{ width: 100, height: 100, mx: "auto" }}
          />

          <Typography variant="h4" sx={{ mb: 5, mt: 2, fontWeight: 500 }}>
            Login
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Please enter your email",
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email format",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>

                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Please enter your password" }}
                  render={({ field, fieldState }) => (
                    <>
                      <OutlinedInput
                        {...field}
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              onClick={onClickShowPassword}
                              onMouseDown={onMouseDownPassword}
                              onMouseUp={onMouseUpPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                        error={!!fieldState.error}
                      />

                      {fieldState.error && (
                        <FormHelperText error>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Stack>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 2,
                marginBottom: 5,
              }}
            >
              <FormControlLabel
                control={<Checkbox name="remember" />}
                label="Remember me"
              />

              <Link href="#" underline="hover">
                Forget password?
              </Link>
            </Box>

            <Button variant="contained" fullWidth size="large" type="submit">
              Log in
            </Button>
          </form>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Link href="#" underline="hover">
              Or create an account
            </Link>
          </Box>
        </Box>
      </Container>

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
    </>
  );
}

export default Login;
