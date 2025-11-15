'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert, 
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // LLAMADA REAL AL BACKEND PARA REGISTRO
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name: name,
        email: email,
        password: password,
        role: role
      });

      console.log('Usuario registrado:', response.data);
      setSuccess('¡Registro exitoso! Redirigiendo al login...');
      
      // Esperar 2 segundos y redirigir al login
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.response?.data || 'Error en el registro');
    } finally {
      setLoading(false);
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
          Registrarse
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="Tu nombre"
            required
          />
          
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
            placeholder="Mínimo 6 caracteres"
            required
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de usuario</InputLabel>
            <Select
              value={role}
              label="Tipo de usuario"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="user">Usuario Normal</MenuItem>
              <MenuItem value="artist">Artista</MenuItem>
            </Select>
          </FormControl>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
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
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            ¿Ya tienes cuenta?{' '}
            <Button 
              variant="text" 
              size="small" 
              onClick={() => router.push('/login')}
            >
              Iniciar Sesión
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}