import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface Props {
  id: string;
  label: string;
  items: string[];
  value: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export default function ConfigurationSelect({ id, label, items, value, defaultValue, disabled, onChange }: Props) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        defaultValue={defaultValue}
        value={value}
        label={label}
        disabled={disabled}
        onChange={({ target }) => {
          onChange?.(target.value);
        }}
      >
        {items.map(item => (<MenuItem value={item} key={item}>{item}</MenuItem>))}
      </Select>
    </FormControl>
  );
}
