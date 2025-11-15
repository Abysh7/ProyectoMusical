'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '@/lib/slices/authSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert, 
  Paper,
  CircularProgress
} from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch(loginStart());
    
    try {
      // LLAMADA REAL AL BACKEND CON AXIOS
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });

      console.log('Respuesta del backend:', response.data);
      
      // ✅ USAR LA RESPUESTA REAL DEL BACKEND
      const user = response.data; // El backend ahora envía el usuario completo
      
      dispatch(loginSuccess(user));
      
      // Redirigir según el rol REAL del backend
      if (user.role === 'artist') {
        router.push('/artist');
      } else {
        router.push('/user');
      }
      
    } catch (err) {
      console.error('Error en login:', err);
      dispatch(loginFailure('Email o contraseña incorrectos'));
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: 2
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          maxWidth: 400, 
          width: '100%' 
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Iniciar Sesión
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="usuario@ejemplo.com"
            required
          />
          
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Ingresa tu contraseña"
            required
          />
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </Button>
        </form>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            ¿No tienes cuenta?{' '}
            <Button 
              variant="text" 
              size="small" 
              onClick={() => router.push('/register')}
            >
              Regístrate
            </Button>
          </Typography>
        </Box>

        <Box sx={{ mt: 3, fontSize: '14px', color: 'text.secondary' }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            ✅ Conectado al backend Java - Usando datos reales
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}