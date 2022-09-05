import Typography from '@mui/material/Typography';

interface Props {
  text: string;
}

export default function AreaHeader({ text }: Props) {
  return (
    <Typography
      variant="h6"
      noWrap
      component="h6"
      sx={{
        mt: 3,
        fontSize: '1.1rem',
        fontWeight: 400,
        color: 'text.secondary',
        textDecoration: 'none',
      }}
    >
      {text}
    </Typography>
  );
}
