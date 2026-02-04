import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

export default function PopularCard({ isLoading, productos = [] }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Stack sx={{ gap: gridSpacing }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">Productos Populares</Typography>
                <IconButton size="small" sx={{ mt: -0.625 }}>
                  <MoreHorizOutlinedIcon
                    fontSize="small"
                    sx={{ cursor: 'pointer' }}
                    aria-controls="menu-popular-card"
                    aria-haspopup="true"
                    onClick={handleClick}
                  />
                </IconButton>
              </Stack>
              <Menu
                id="menu-popular-card"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                variant="selectedMenu"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleClose}> Hoy</MenuItem>
                <MenuItem onClick={handleClose}> Este Mes</MenuItem>
                <MenuItem onClick={handleClose}> Este Año </MenuItem>
              </Menu>

              {/* CLAVE: Pasamos los productos al componente del gráfico morado */}
              <BajajAreaChartCard isLoading={isLoading} productos={productos} />

              {/* Mapeamos tus productos reales de MongoDB */}
              <Box>
                {productos.length > 0 ? (
                  productos.map((producto, index) => (
                    <React.Fragment key={producto._id || index}>
                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                          {producto.nombre}
                        </Typography>
                        <Stack direction="row" sx={{ alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
                            ${Number(producto.precio).toLocaleString('es-CO')}
                          </Typography>
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '5px',
                              bgcolor: producto.stock > 10 ? 'success.light' : 'orange.light',
                              color: producto.stock > 10 ? 'success.dark' : 'orange.dark',
                              ml: 2
                            }}
                          >
                            {producto.stock > 10 ? (
                              <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                            ) : (
                              <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
                            )}
                          </Avatar>
                        </Stack>
                      </Stack>
                      <Typography variant="subtitle2" sx={{ color: producto.stock > 10 ? 'success.dark' : 'orange.dark' }}>
                        {producto.stock} Unidades en Stock
                      </Typography>
                      {index !== productos.length - 1 && <Divider sx={{ my: 1.5 }} />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="subtitle2" sx={{ textAlign: 'center', py: 2 }}>
                    No hay productos en inventario
                  </Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              Ver Todo
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
}

PopularCard.propTypes = { 
  isLoading: PropTypes.bool,
  productos: PropTypes.array 
};