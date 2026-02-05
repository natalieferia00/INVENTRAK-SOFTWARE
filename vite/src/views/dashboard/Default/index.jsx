import { useEffect, useState, useCallback } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard'; 
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);

  const cargarInventario = useCallback(() => {
    setLoading(true);
    try {
      const datosLocales = localStorage.getItem('inventrak_productos');
      if (datosLocales) {
        setProductos(JSON.parse(datosLocales));
      }
    } catch (error) {
      console.error("Error al leer LocalStorage", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    cargarInventario();
    
    // Escucha cambios desde otras pestañas (Inventario -> Dashboard)
    window.addEventListener('storage', cargarInventario);
    return () => window.removeEventListener('storage', cargarInventario);
  }, [cargarInventario]);

  // Cálculos dinámicos
  const stockFisicoTotal = productos.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const valorMonetarioTotal = productos.reduce((sum, p) => sum + (Number(p.precio || 0) * Number(p.stock || 0)), 0);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          
          {/* Card 1: Valor total de la inversión (Precio * Stock) */}
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} total={valorMonetarioTotal} />
          </Grid>

          {/* Card 2: Conteo de productos únicos (Variedad) */}
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} count={productos.length} />
          </Grid>

          {/* Card 3: Suma total de unidades físicas disponibles */}
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <TotalIncomeDarkCard isLoading={isLoading} total={stockFisicoTotal} />
          </Grid>

        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          
          {}
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} productos={productos} />
          </Grid>

          {}
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} productos={productos} />
          </Grid>

        </Grid>
      </Grid>
    </Grid>
  );
}