import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';

export default function EarningCard({ isLoading, total }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // --- REFUERZO DE SINCRONIZACIÓN ---
  // Convertimos a número por si el backend envía un string y formateamos
  const formattedTotal = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(Number(total) || 0);

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'secondary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: '50%',
              top: { xs: -125 },
              right: { xs: -15 },
              opacity: 0.5
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.largeAvatar,
                  borderRadius: 2,
                  bgcolor: 'secondary.800',
                  mt: 1
                }}
              >
                <CardMedia sx={{ width: 30, height: 30 }} component="img" src={EarningIcon} alt="Inventario" />
              </Avatar>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  bgcolor: 'secondary.dark',
                  color: 'secondary.200',
                  zIndex: 1
                }}
                onClick={handleClick}
              >
                <MoreHorizIcon fontSize="inherit" />
              </Avatar>
            </Stack>
            
            <Menu
              id="menu-earning-card"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleClose}> <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Card </MenuItem>
              <MenuItem onClick={handleClose}> <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Copy Data </MenuItem>
              <MenuItem onClick={handleClose}> <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Export </MenuItem>
              <MenuItem onClick={handleClose}> <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Archive File </MenuItem>
            </Menu>

            <Stack direction="row" sx={{ alignItems: 'center' }}>
              <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                {/* Mostramos el valor total sincronizado */}
                {formattedTotal}
              </Typography>
              <Avatar sx={{ ...theme.typography.smallAvatar, bgcolor: 'secondary.200', color: 'secondary.dark' }}>
                <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
              </Avatar>
            </Stack>

            <Typography
              sx={{
                mb: 1.25,
                fontSize: '1rem',
                fontWeight: 500,
                color: 'secondary.200'
              }}
            >
              Valor Total de Inventario
            </Typography>
          </Box>
        </MainCard>
      )}
    </>
  );
}

EarningCard.propTypes = { 
  isLoading: PropTypes.bool,
  total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) // Aceptamos ambos por si el backend varía
};