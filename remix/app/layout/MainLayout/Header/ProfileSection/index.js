// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar } from '@mui/material';

// assets
import { IconUser } from '@tabler/icons-react';

// ==============================|| PROFILE SECTION - STATIC ||============================== //

const ProfileSection = () => {
    const theme = useTheme();

    return (
        <Avatar
            variant="rounded"
            sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                cursor: 'default',
                '&:hover': {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.light
                }
            }}
            color="inherit"
        >
            <IconUser stroke={1.5} size="1.5rem" />
        </Avatar>
    );
};

export default ProfileSection;