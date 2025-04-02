import { TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";

interface TextInputProps {
  control: Control;
  name: string;
  defaultValue: string;
  label: string,
}

function TextInput({control, name, defaultValue, label}: TextInputProps) {
  return (
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
  );
}

export default TextInput;
