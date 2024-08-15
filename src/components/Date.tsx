import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface iProps {
  setValue: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  value: dayjs.Dayjs | null;
}

export const Date: React.FC<iProps> = ({ setValue, value }) => {
  const handleChange = (newValue: dayjs.Dayjs | null) => {
    setValue(newValue || dayjs());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Data de Vencimento"
        value={value ?? dayjs("2022-04-17")}
        onChange={handleChange}
        data-testid="date-input"
      />
    </LocalizationProvider>
  );
};
