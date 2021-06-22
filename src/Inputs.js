
﻿import React from "react";
import { Controller } from "react-hook-form";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const Input = ({ control, name, label, type, rules, defaultValue }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          type={type}
          label={label}
          variant="filled"
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error ? error.message : null}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      )}
      rules={rules}
    />
  );
};

export const TextInput = ({ control, name, label, rules, defaultValue = undefined }) => {
  return Input({ control, name, label, type: "text", rules, defaultValue });
};

export const SelectInput = ({
  control,
  name,
  label,
  list,
  extractId,
  extractValue,
  rules,
  defaultValue = undefined
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          select
          label={label}
          variant="filled"
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error ? error.message : null}
          fullWidth
          InputLabelProps={{ shrink: true }}
        >
          {list.map((item) => (
            <MenuItem key={extractId(item)} value={extractId(item)}>
              {extractValue(item)}
            </MenuItem>
          ))}
        </TextField>
      )}
      rules={rules}
    />
  );
};