// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

// assets
import { IconBell } from '@tabler/icons-react';

// ==============================|| NOTIFICATION SECTION - STATIC ||============================== //

export default function NotificationSection() {
  const theme = useTheme();

  return (
    <Box sx={{ ml: 2 }}>
      <Avatar
        variant="rounded"
        sx={{
          ...theme.typography.commonAvatar,
          ...theme.typography.mediumAvatar,
          transition: 'all .2s ease-in-out',
          color: theme.palette.warning.dark,
          background: theme.palette.warning.light,
          cursor: 'default',
          '&:hover': {
            color: theme.palette.warning.light,
            background: theme.palette.warning.dark
          }
        }}
      >
        <IconBell stroke={1.5} size="20px" />
      </Avatar>
    </Box>
  );
}