import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

interface Props {
  label: string;
  items: string[];
  value: string;
  row?: boolean;
  onChange?: (value: string) => void;
}

export default function ConfigurationRadio({ label, items, value, row, onChange }: Props) {
  return (
    <FormControl>
      <FormLabel id={`radio-group-${label}`}>{label}</FormLabel>
      <RadioGroup
        row={row}
        aria-labelledby={`radio-group-${label}`}
        name={`radio-group-${label}`}
        value={value}
        onChange={({ target }) => {
          onChange?.(target.value);
        }}
      >
        {items.map(item => (<FormControlLabel value={item} key={item} control={<Radio />} label={item} />))}
      </RadioGroup>
    </FormControl>
  );
}
