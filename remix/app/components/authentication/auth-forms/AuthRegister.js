import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Button, FormControl, FormHelperText, Grid, 
    IconButton, InputAdornment, InputLabel, OutlinedInput, TextField 
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthRegister = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Formik
            initialValues={{
                fname: '',
                lname: '',
                email: '',
                password: '',
                submit: null
            }}
            validationSchema={Yup.object().shape({
                fname: Yup.string().required('Requerido'),
                lname: Yup.string().required('Requerido'),
                email: Yup.string().email('Email inválido').required('Requerido'),
                password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido')
            })}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
                try {
                    const response = await fetch('http://localhost:5000/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(values)
                    });
                    if (response.ok) {
                        navigate('/login');
                    } else {
                        const data = await response.json();
                        setErrors({ submit: data.error });
                    }
                } catch (err) {
                    setErrors({ submit: 'Error de conexión con el backend' });
                }
                setSubmitting(false);
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="fname"
                                value={values.fname}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={Boolean(touched.fname && errors.fname)}
                                helperText={touched.fname && errors.fname}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lname"
                                value={values.lname}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={Boolean(touched.lname && errors.lname)}
                                helperText={touched.lname && errors.lname}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        margin="normal"
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                    />

                    <FormControl fullWidth margin="normal" error={Boolean(touched.password && errors.password)}>
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                        {touched.password && errors.password && (
                            <FormHelperText error>{errors.password}</FormHelperText>
                        )}
                    </FormControl>

                    {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                        <Button
                            disabled={isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="secondary"
                        >
                            Sign Up
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default AuthRegister;