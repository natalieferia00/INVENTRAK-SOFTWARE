import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// Proyecto local
import getBajajChartData from './chart-data/bajaj-area-chart';

const BajajAreaChartCard = ({ isLoading, productos = [] }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const { navType } = customization;

    const orangeDark = theme.palette.secondary.main;

    // 1. Inicializamos el estado con los datos base una sola vez
    const [options, setOptions] = useState(() => getBajajChartData(productos).options);
    const [series, setSeries] = useState([]);

    // 2. EFECTO: Solo se ejecuta cuando cambian los productos o el tema
    useEffect(() => {
        const chartConfig = getBajajChartData(productos);
        
        // Actualizamos las opciones (colores y tema)
        setOptions((prevOptions) => ({
            ...prevOptions,
            colors: [orangeDark],
            labels: productos.map(p => p.nombre), // Sincronización de nombres
            tooltip: {
                ...prevOptions.tooltip,
                theme: navType === 'dark' ? 'dark' : 'light'
            }
        }));

        // Actualizamos los datos (series)
        setSeries([{
            name: 'Existencias',
            data: productos.map(p => Number(p.stock || 0))
        }]);

    // IMPORTANTE: El array de dependencias evita el bucle infinito
    }, [productos, orangeDark, navType]); 

    return (
        <Card sx={{ bgcolor: 'secondary.light' }}>
            <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.dark }}>
                                Bajaj Stock
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h4" sx={{ color: theme.palette.grey[800] }}>
                                {productos.length} Items
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {!isLoading && (
                <Chart 
                    options={options} 
                    series={series} 
                    type="area" 
                    height={95} 
                />
            )}
        </Card>
    );
};

export default BajajAreaChartCard;