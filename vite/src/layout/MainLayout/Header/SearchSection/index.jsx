import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  InputAdornment,
  OutlinedInput,
  Popper,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
  Chip,
  CircularProgress
} from '@mui/material';

// assets
import { IconSearch, IconPackage } from '@tabler/icons-react';

export default function SearchSection() {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [value, setValue] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const buscarProducto = async () => {
      if (value.trim().length < 2) {
        setResultados([]);
        return;
      }

      setLoading(true);
      try {
        // Sincronizado con tu puerto 5000
        const res = await fetch(`http://localhost:5000/api/productos`);
        const data = await res.json();
        
        // Filtramos localmente para respuesta inmediata, o podrías filtrar en el backend
        const filtrados = data.filter(p => 
          p.nombre.toLowerCase().includes(value.toLowerCase()) || 
          p.categoria?.toLowerCase().includes(value.toLowerCase())
        );
        
        setResultados(filtrados.slice(0, 5)); // Mostrar solo los 5 más relevantes
      } catch (error) {
        console.error("Error en búsqueda:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(buscarProducto, 300);
    return () => clearTimeout(timer);
  }, [value]);

  const handleSelect = (producto) => {
    // Al hacer clic, podrías ir al detalle o simplemente limpiar
    setValue('');
    setAnchorEl(null);
    navigate('/dashboard/inventario'); // Redirige a tu página de tabla
  };

  return (
    <Box sx={{ display: 'block', position: 'relative' }}>
      <OutlinedInput
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setAnchorEl(e.currentTarget);
        }}
        placeholder="Buscar laptop, teclado..."
        startAdornment={
          <InputAdornment position="start">
            {loading ? <CircularProgress size={16} color="inherit" /> : <IconSearch stroke={1.5} size="16px" />}
          </InputAdornment>
        }
        sx={{ width: { xs: '100%', md: 250, lg: 434 }, ml: 2, px: 2 }}
      />

      <Popper 
        open={Boolean(anchorEl) && resultados.length > 0 && value.length > 0} 
        anchorEl={anchorEl} 
        placement="bottom-start" 
        style={{ width: 434, zIndex: 1300, paddingTop: 8 }}
      >
        <Paper elevation={16} sx={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
          <List sx={{ p: 0 }}>
            {resultados.map((producto) => (
              <ListItemButton key={producto._id} onClick={() => handleSelect(producto)}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                  <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                    <IconPackage size="20px" />
                  </Avatar>
                  
                  <ListItemText
                    primary={<Typography variant="subtitle1">{producto.nombre}</Typography>}
                    secondary={<Typography variant="caption">{producto.categoria || 'Sin categoría'}</Typography>}
                  />

                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle2" color="secondary.main">
                      ${Number(producto.precio).toLocaleString('es-CO')}
                    </Typography>
                    <Chip 
                      label={`${producto.stock} en stock`} 
                      size="small" 
                      color={producto.stock < 5 ? "error" : "success"}
                      variant="light"
                      sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                  </Stack>
                </Stack>
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Popper>
    </Box>
  );
}