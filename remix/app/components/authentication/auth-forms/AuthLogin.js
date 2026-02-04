import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthLogin = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    const [checked, setChecked] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email('Debe ser un correo válido').max(255).required('Email requerido'),
                password: Yup.string().max(255).required('Contraseña requerida')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                console.log("Iniciando sesión en el Backend...");
                
                try {
                    const response = await fetch('http://localhost:5000/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: values.email,
                            password: values.password
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        console.log("Login exitoso:", data.message);
                        
                        // Guardamos el estado de la sesión y datos básicos del usuario
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('userSession', JSON.stringify(data.user));

                        setStatus({ success: true });
                        setSubmitting(false);
                        
                        // Redirigir al dashboard
                        navigate('/dashboard/default');
                    } else {
                        // El backend devuelve error si el usuario no existe o la clave no coincide
                        setErrors({ submit: data.error || 'Credenciales inválidas' });
                        setSubmitting(false);
                    }
                } catch (err) {
                    console.error("Error de conexión:", err);
                    setErrors({ submit: 'Error al conectar con el servidor' });
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} {...others}>
                    <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                        <InputLabel>Correo Electrónico</InputLabel>
                        <OutlinedInput
                            name="email"
                            type="email"
                            value={values.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Correo Electrónico"
                        />
                        {touched.email && errors.email && (
                            <FormHelperText error>{errors.email}</FormHelperText>
                        )}
                    </FormControl>

                    <FormControl
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        sx={{ ...theme.typography.customInput, mt: 2 }}
                    >
                        <InputLabel>Contraseña</InputLabel>
                        <OutlinedInput
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Contraseña"
                        />
                        {touched.password && errors.password && (
                            <FormHelperText error>{errors.password}</FormHelperText>
                        )}
                    </FormControl>

                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={(event) => setChecked(event.target.checked)}
                                    name="checked"
                                    color="primary"
                                />
                            }
                            label="Recordarme"
                        />
                        <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                            ¿Olvidaste tu contraseña?
                        </Typography>
                    </Stack>

                    {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                Iniciar Sesión
                            </Button>
                        </AnimateButton>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default AuthLogin;