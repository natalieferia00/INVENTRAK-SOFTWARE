import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard'; 
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);

  // ✅ CAMBIO CLAVE: Se actualizó la URL de localhost a tu URL real de Render
  const cargarInventario = async () => {
    try {
      // Usamos la URL que ya confirmamos que devuelve []
      const res = await fetch('https://backend-inventrak.onrender.com/api/productos');
      
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al sincronizar widgets con Render:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  // Cálculos dinámicos exactos de tu MongoDB Atlas
  const stockFisicoTotal = productos.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const valorMonetarioTotal = productos.reduce((sum, p) => sum + (Number(p.precio || 0) * Number(p.stock || 0)), 0);

  return (
    <Grid container spacing={gridSpacing}>
      {/* ... resto del JSX se mantiene igual ... */}
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <EarningCard isLoading={isLoading} total={valorMonetarioTotal} />
          </Grid>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <TotalOrderLineChartCard isLoading={isLoading} count={productos.length} />
          </Grid>
          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeDarkCard isLoading={isLoading} total={stockFisicoTotal} />
              </Grid>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeLightCard
                  isLoading={isLoading}
                  total={productos.length}
                  label="Productos Registrados"
                  icon={<StorefrontTwoToneIcon fontSize="inherit" />}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TotalGrowthBarChart isLoading={isLoading} productos={productos} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <PopularCard isLoading={isLoading} productos={productos} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}