import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import Logo from "@/assets/images/login.png";

function Login() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: "Please enter your password" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  id="outlined-basic"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
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
  );
}

export default Login;
