import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import barChartOptions from './chart-data/total-growth-bar-chart';

const status = [
  { value: 'today', label: 'Hoy' },
  { value: 'month', label: 'Este Mes' },
  { value: 'year', label: 'Este Año' }
];

// Recibimos 'productos' como prop
export default function TotalGrowthBarChart({ isLoading, productos = [] }) {
  const theme = useTheme();
  const {
    state: { fontFamily }
  } = useConfig();

  const [value, setValue] = useState('today');
  const [chartOptions, setChartOptions] = useState(barChartOptions);
  
  // Procesamos los datos de MongoDB para la gráfica
  // Mostraremos una serie con el Stock por Producto
  const series = [
    {
      name: 'Stock Disponible',
      data: productos.map((p) => Number(p.stock))
    }
  ];

  // Calculamos el valor total para el título
  const valorTotal = productos.reduce((sum, p) => sum + (Number(p.precio) * Number(p.stock)), 0);

  const textPrimary = theme.vars.palette.text.primary;
  const divider = theme.vars.palette.divider;
  const grey500 = theme.vars.palette.grey[500];

  const primary200 = theme.vars.palette.primary[200];
  const primaryDark = theme.vars.palette.primary.dark;
  const secondaryMain = theme.vars.palette.secondary.main;
  const secondaryLight = theme.vars.palette.secondary.light;

  useEffect(() => {
    setChartOptions({
      ...barChartOptions,
      chart: { ...barChartOptions.chart, fontFamily: fontFamily },
      colors: [primaryDark, secondaryMain], // Colores de tu marca
      xaxis: { 
        ...barChartOptions.xaxis, 
        categories: productos.map((p) => p.nombre), // Nombres de tus productos en el eje X
        labels: { style: { colors: textPrimary } } 
      },
      yaxis: { ...barChartOptions.yaxis, labels: { style: { colors: textPrimary } } },
      grid: { borderColor: divider },
      tooltip: { theme: 'light' },
      legend: { ...(barChartOptions.legend ?? {}), labels: { ...(barChartOptions.legend?.labels ?? {}), colors: grey500 } }
    });
  }, [fontFamily, primary200, primaryDark, secondaryMain, secondaryLight, textPrimary, grey500, divider, productos]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Stack sx={{ gap: gridSpacing }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack sx={{ gap: 1 }}>
                <Typography variant="subtitle2">Crecimiento de Inventario</Typography>
                <Typography variant="h3">
                  ${valorTotal.toLocaleString('es-CO')}
                </Typography>
              </Stack>
              <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
                {status.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Box
              sx={{
                ...theme.applyStyles('light', {
                  '& .apexcharts-series:nth-of-type(4) path:hover': {
                    filter: `brightness(0.95)`,
                    transition: 'all 0.3s ease'
                  }
                })
              }}
            >
              <Chart options={chartOptions} series={series} type="bar" height={480} />
            </Box>
          </Stack>
        </MainCard>
      )}
    </>
  );
}

TotalGrowthBarChart.propTypes = { 
    isLoading: PropTypes.bool,
    productos: PropTypes.array 
};