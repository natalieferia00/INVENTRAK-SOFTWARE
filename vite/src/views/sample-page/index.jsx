import { useState, useEffect } from 'react';

// material-ui
import { 
  Typography, Grid, Button, TextField, Stack, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Chip,
  CircularProgress, Box, Divider, InputAdornment
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import { 
  IconTrash, 
  IconPencil, 
  IconPlus, 
  IconDeviceFloppy, 
  IconRefresh, 
  IconPackage, 
  IconX 
} from '@tabler/icons-react';

export default function InventarioPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', categoria: '', stock: '', precio: '' });
  const [editandoId, setEditandoId] = useState(null);

  // CLAVE PARA LOCALSTORAGE
  const LS_KEY = 'inventrak_productos';

  // 1. CARGAR (READ)
  const cargarProductos = () => {
    setLoading(true);
    setTimeout(() => { // Simula un pequeño delay para que el skeleton/spinner se vea bien
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        setProductos(JSON.parse(stored));
      }
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // 2. GUARDAR (CREATE / UPDATE)
  const handleGuardar = (e) => {
    e.preventDefault();
    if (!form.nombre || form.stock === '') return;

    let nuevosProductos;
    
    if (editandoId) {
      // Editar existente
      nuevosProductos = productos.map((p) => 
        p.id === editandoId ? { ...form, id: editandoId, stock: Number(form.stock), precio: Number(form.precio) } : p
      );
    } else {
      // Crear nuevo con ID único (timestamp)
      const nuevoProducto = {
        ...form,
        id: Date.now(),
        stock: Number(form.stock),
        precio: Number(form.precio)
      };
      nuevosProductos = [nuevoProducto, ...productos];
    }

    localStorage.setItem(LS_KEY, JSON.stringify(nuevosProductos));
    setProductos(nuevosProductos);
    
    // Resetear formulario
    setForm({ nombre: '', categoria: '', stock: '', precio: '' });
    setEditandoId(null);
  };

  // 3. PREPARAR EDICIÓN
  const prepararEdicion = (producto) => {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      stock: producto.stock,
      precio: producto.precio
    });
  };

  // 4. ELIMINAR (DELETE)
  const handleEliminar = (id) => {
    if (window.confirm('¿Deseas eliminar este producto de INVENTRAK?')) {
      const filtrados = productos.filter(p => p.id !== id);
      localStorage.setItem(LS_KEY, JSON.stringify(filtrados));
      setProductos(filtrados);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      {/* HEADER DE LA PÁGINA */}
      <Grid item xs={12}>
        <MainCard border={false} sx={{ mb: 3, bgcolor: 'primary.light' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" color="primary.800" gutterBottom>
                Panel de Inventario (Local)
              </Typography>
              <Typography variant="subtitle2" color="grey.700">
                Gestión directa en navegador sin servidor activo.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<IconRefresh size="20" />} 
              onClick={cargarProductos}
              sx={{ boxShadow: 3 }}
            >
              Refrescar
            </Button>
          </Stack>
        </MainCard>
      </Grid>

      {/* COLUMNA FORMULARIO */}
      <Grid item xs={12} md={4}>
        <MainCard 
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              {editandoId ? <IconPencil color="#5e35b1" /> : <IconPlus color="#2196f3" />}
              <span>{editandoId ? "Editar Producto" : "Agregar Producto"}</span>
            </Stack>
          }
        >
          <form onSubmit={handleGuardar}>
            <Stack spacing={2.5}>
              <TextField 
                label="Nombre del Producto" 
                fullWidth 
                required
                value={form.nombre}
                onChange={(e) => setForm({...form, nombre: e.target.value})}
              />
              <TextField 
                label="Categoría" 
                fullWidth 
                value={form.categoria}
                onChange={(e) => setForm({...form, categoria: e.target.value})}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField 
                    label="Stock" 
                    type="number" 
                    fullWidth
                    required
                    value={form.stock}
                    onChange={(e) => setForm({...form, stock: e.target.value})}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    label="Precio" 
                    type="number" 
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    value={form.precio}
                    onChange={(e) => setForm({...form, precio: e.target.value})}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 1 }} />

              <Stack spacing={1}>
                <Button 
                  variant="contained" 
                  color={editandoId ? "secondary" : "primary"}
                  startIcon={editandoId ? <IconDeviceFloppy size="20" /> : <IconPlus size="20" />} 
                  type="submit"
                  fullWidth
                  size="large"
                >
                  {editandoId ? "Guardar Cambios" : "Registrar en Stock"}
                </Button>
                
                {editandoId && (
                  <Button 
                    color="error" 
                    variant="text" 
                    startIcon={<IconX size="18" />}
                    onClick={() => { setEditandoId(null); setForm({nombre:'', categoria:'', stock:'', precio:''}) }}
                  >
                    Cancelar Edición
                  </Button>
                )}
              </Stack>
            </Stack>
          </form>
        </MainCard>
      </Grid>

      {/* COLUMNA TABLA */}
      <Grid item xs={12} md={8}>
        <MainCard 
          content={false} 
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <IconPackage color="#673ab7" />
              <span>Existencias Actuales</span>
            </Stack>
          }
        >
          {loading ? (
            <Stack alignItems="center" p={10}><CircularProgress /></Stack>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 600 }}>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ pl: 3 }}>Detalles</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="right">Precio Unitario</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.map((row) => (
                    <TableRow 
                      key={row.id} 
                      hover 
                      sx={{ 
                        bgcolor: editandoId === row.id ? 'secondary.light' : 'inherit',
                      }}
                    >
                      <TableCell sx={{ pl: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'grey.800' }}>
                          {row.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={row.categoria || 'General'} variant="outlined" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={row.stock} 
                          sx={{ 
                            fontWeight: 'bold',
                            bgcolor: row.stock < 5 ? 'error.light' : row.stock < 15 ? 'warning.light' : 'success.light',
                            color: row.stock < 5 ? 'error.dark' : row.stock < 15 ? 'warning.dark' : 'success.dark',
                          }} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${Number(row.precio).toLocaleString('es-CO')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" justifyContent="center" spacing={0.5}>
                          <IconButton color="primary" onClick={() => prepararEdicion(row)}>
                            <IconPencil size="20" />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleEliminar(row.id)}>
                            <IconTrash size="20" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {productos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Typography variant="h5" color="grey.400">
                          No hay productos en el almacenamiento local
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
}