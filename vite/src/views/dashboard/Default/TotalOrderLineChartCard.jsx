import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, Grid, Stack, Typography, Box } from '@mui/material';

// third party
import Chart from 'react-apexcharts';

// project imports
import chartOptions from './chart-data/total-order-line-chart';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function TotalOrderLineChartCard({ isLoading, count }) {
  const theme = useTheme();
  const [timeValue, setTimeValue] = useState(false);
  const [series, setSeries] = useState([{ data: [0, 0, 0, 0, 0, 0, 0] }]);

  useEffect(() => {
    // Generamos una línea que termina en la cantidad actual de productos
    const baseData = timeValue ? [5, 12, 8, 20, 15, 25] : [2, 8, 5, 15, 10, 20];
    setSeries([{ data: [...baseData, count || 0] }]);
  }, [count, timeValue]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'primary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute', width: 210, height: 210,
              background: theme.palette.primary[800],
              borderRadius: '50%', top: -85, right: -95
            },
            '&:before': {
              content: '""',
              position: 'absolute', width: 210, height: 210,
              background: theme.palette.primary[800],
              borderRadius: '50%', top: -125, right: -15, opacity: 0.5
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Stack direction="row" justifyContent="space-between">
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.largeAvatar,
                  bgcolor: 'primary.800',
                  color: '#fff',
                  mt: 1
                }}
              >
                <LocalMallOutlinedIcon fontSize="inherit" />
              </Avatar>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  sx={{ color: timeValue ? '#fff' : 'primary.200' }}
                  onClick={() => setTimeValue(true)}
                >
                  Mes
                </Button>
                <Button
                  size="small"
                  sx={{ color: !timeValue ? '#fff' : 'primary.200' }}
                  onClick={() => setTimeValue(false)}
                >
                  Año
                </Button>
              </Stack>
            </Stack>

            <Grid container alignItems="center">
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 1 }}>
                  <Typography sx={{ fontSize: '2.125rem', fontWeight: 500 }}>
                    {count || 0}
                  </Typography>
                  <Avatar 
                    sx={{ 
                      ...theme.typography.smallAvatar, 
                      bgcolor: 'primary.200', 
                      color: 'primary.dark' 
                    }}
                  >
                    <ArrowUpwardIcon fontSize="inherit" />
                  </Avatar>
                </Stack>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'primary.200' }}>
                  Productos Totales
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Chart options={chartOptions} series={series} type="line" height={90} />
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

TotalOrderLineChartCard.propTypes = {
  isLoading: PropTypes.bool,
  count: PropTypes.number
};