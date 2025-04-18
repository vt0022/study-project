import Logo from "@/assets/images/register.png";
import AppConstants from "@/constants/appConstants";
import authService from "@/services/authService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const onClickShowPassword = () => setShowPassword((show) => !show);

  const onMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    const response = await authService.register(
      data.email,
      data.password,
      data.confirmPassword,
      data.firstName,
      data.lastName
    );
    if (response.statusCode !== 200) {
      toast.error(response.message);
    } else {
      navigate("/verify", { state: { email: data.email } });
    }
  };

  return (
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
          alt="Register logo"
          src={Logo}
          sx={{ width: 100, height: 100, mx: "auto" }}
        />

        <Typography variant="h4" sx={{ mb: 5, mt: 2, fontWeight: 500 }}>
          Register
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{
                required: "Please enter your first name",
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  id="outlined-basic"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "Please enter your email",
                pattern: {
                  value: AppConstants.EMAIL_REGEX,
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
                      id="outline-adornment-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "show the password"
                            }
                            onClick={onClickShowPassword}
                            onMouseDown={onMouseDownPassword}
                            onMouseUp={onMouseUpPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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

            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Confirmation password
              </InputLabel>
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                rules={{
                  required: "Please enter your confirmation password",
                  validate: (value) =>
                    value === watch("password") || "Password do not match",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <OutlinedInput
                      {...field}
                      id="outline-adornment-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "show the password"
                            }
                            onClick={onClickShowPassword}
                            onMouseDown={onMouseDownPassword}
                            onMouseUp={onMouseUpPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirmation password"
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

          <Button
            variant="contained"
            fullWidth
            size="large"
            type="submit"
            sx={{ mt: 5 }}
            loading={isSubmitting}
          >
            Register
          </Button>
        </form>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Link href="#" underline="hover">
            Or log in your account
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
