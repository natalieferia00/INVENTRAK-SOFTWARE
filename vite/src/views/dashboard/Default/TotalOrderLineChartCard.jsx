import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Grid, Stack, Typography, Box, Button } from '@mui/material';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

export default function TotalOrderLineChartCard({ isLoading, count }) {
  const theme = useTheme();
  
  // Opciones de la gráfica directamente aquí para evitar el 404
  const chartOptions = {
    chart: { id: 'order-chart', sparkline: { enabled: true } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    tooltip: { theme: 'dark', fixed: { enabled: false }, x: { show: false } },
    colors: ['#fff']
  };

  const [series, setSeries] = useState([{ data: [10, 20, 15, 30, 25, 40, count || 0] }]);

  useEffect(() => {
    setSeries([{ data: [10, 20, 15, 30, 25, 40, count || 0] }]);
  }, [count]);

  return (
    <MainCard
      border={false}
      content={false}
      sx={{
        bgcolor: 'primary.dark',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        '&:after': { content: '""', position: 'absolute', width: 210, height: 210, background: theme.palette.primary[800], borderRadius: '50%', top: -85, right: -95 },
      }}
    >
      <Box sx={{ p: 2.25 }}>
        <Stack direction="row" justifyContent="space-between">
          <Avatar variant="rounded" sx={{ bgcolor: 'primary.800', color: '#fff' }}>
            <LocalMallOutlinedIcon />
          </Avatar>
        </Stack>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mt: 2 }}>
              {count || 0}
            </Typography>
            <Typography sx={{ fontSize: '1rem', color: 'primary.200' }}>
              Productos
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Chart options={chartOptions} series={series} type="line" height={90} />
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
}