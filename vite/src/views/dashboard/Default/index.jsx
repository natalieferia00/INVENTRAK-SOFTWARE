import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard'; // Este componente suele contener a Bajaj o las métricas laterales
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

  const cargarInventario = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/productos');
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al sincronizar widgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  // Cálculos dinámicos exactos de tu MongoDB
  const stockFisicoTotal = productos.reduce((sum, p) => sum + Number(p.stock), 0);
  const valorMonetarioTotal = productos.reduce((sum, p) => sum + (Number(p.precio) * Number(p.stock)), 0);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            {/* Si EarningCard no cambia, es que ignora la prop 'total' */}
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
                  {...{
                    isLoading: isLoading,
                    total: productos.length,
                    label: 'Productos Registrados',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />
                  }}
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
            {/* IMPORTANTE: PopularCard es el que maneja la sección donde viste el "0" */}
            <PopularCard isLoading={isLoading} productos={productos} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}