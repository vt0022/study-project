import Logo from "@/assets/images/login.png";
import { storeUser } from "@/redux/slices/userSlice";
import authService from "@/services/authService";
import { toastOptions } from "@/utils/toastOptions";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
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
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const response = await authService.login(data.email, data.password);
    if (response.statusCode !== 200) {
      toast.error(response.message, toastOptions);
    } else {
      toast.success(response.message, toastOptions);
      // Get user data from response
      const user: User = response.data.user;
      // Store and persist user data
      dispatch(storeUser(user));
      navigate("/home");
    }
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
            backgroundColor: "white"
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
                    value: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/,
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

            <Button
              variant="contained"
              fullWidth
              size="large"
              type="submit"
              loading={isSubmitting}
            >
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
    </>
  );
}

export default Login;
