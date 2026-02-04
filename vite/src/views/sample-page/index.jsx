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

// assets - Usando iconos de Tabler para coherencia con Berry
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

  const API_URL = 'http://localhost:5000/api/productos';

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.nombre || form.stock === '') return;

    try {
      const method = editandoId ? 'PUT' : 'POST';
      const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          stock: Number(form.stock),
          precio: Number(form.precio)
        })
      });

      if (res.ok) {
        setForm({ nombre: '', categoria: '', stock: '', precio: '' });
        setEditandoId(null);
        cargarProductos();
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  const prepararEdicion = (producto) => {
    setEditandoId(producto._id);
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      stock: producto.stock,
      precio: producto.precio
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Deseas eliminar este producto de INVENTRAK?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cargarProductos();
      } catch (error) {
        alert("No se pudo eliminar el producto");
      }
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
                Panel de Inventario
              </Typography>
              <Typography variant="subtitle2" color="grey.700">
                
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<IconRefresh size="20" />} 
              onClick={cargarProductos}
              sx={{ boxShadow: 3 }}
            >
              Sincronizar
            </Button>
          </Stack>
        </MainCard>
      </Grid>

      {/* COLUMNA FORMULARIO (4 columnas) */}
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
                variant="outlined"
                value={form.nombre}
                onChange={(e) => setForm({...form, nombre: e.target.value})}
              />
              <TextField 
                label="Categoría" 
                fullWidth 
                variant="outlined"
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

      {/* COLUMNA TABLA (8 columnas) */}
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
            <TableContainer>
              <Table sx={{ minWidth: 600 }}>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ pl: 3 }}>Detalles del Producto</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="right">Precio Unitario</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.map((row) => (
                    <TableRow 
                      key={row._id} 
                      hover 
                      sx={{ 
                        transition: '0.3s',
                        bgcolor: editandoId === row._id ? 'secondary.light' : 'inherit',
                        '&:last-child td, &:last-child th': { border: 0 } 
                      }}
                    >
                      <TableCell sx={{ pl: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'grey.800' }}>
                          {row.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={row.categoria || 'Sin clase'} variant="outlined" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={row.stock} 
                          sx={{ 
                            fontWeight: 'bold',
                            minWidth: 45,
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
                          <IconButton 
                            sx={{ color: 'primary.main', '&:hover': { bgcolor: 'primary.light' } }} 
                            onClick={() => prepararEdicion(row)}
                          >
                            <IconPencil size="20" />
                          </IconButton>
                          <IconButton 
                            sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.light' } }} 
                            onClick={() => handleEliminar(row._id)}
                          >
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
                          No hay productos registrados
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