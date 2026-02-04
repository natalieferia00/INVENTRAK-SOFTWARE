// ==============================|| OVERRIDES - AVATAR ||============================== //

export default function Avatar(theme) {
  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          // Se dejan vacíos los overrides globales para permitir 
          // que los estilos individuales de cada componente manden.
        }
      }
    }
  };
}