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
import Logo from "@/assets/images/register.png";

function Register() {
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

          <Button variant="contained" fullWidth size="large" type="submit" sx={{mt: 5}}>
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
