import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  label: string;
  value: string;
  icon?: JSX.Element;
  unit?: string;
}

export default function ParameterOutput({ label, icon, value, unit }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box mr={0.5} sx={{ display: 'flex', alignItems: 'center' }}>{icon}</Box>
      <Typography variant="body1" minWidth={60} color="text.primary">{label}</Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        m={1}
        p={0.5}
        minWidth={60}
        sx={{
          border: "1px #ccc solid",
          borderRadius: "4px",
          bgcolor: "#fcfcfc",
        }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.primary">
        {unit}
      </Typography>
    </Box>
  );
}
