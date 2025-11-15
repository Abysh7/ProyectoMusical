'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/lib/slices/authSlice';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { Add, Logout } from '@mui/icons-material';

export default function ArtistDashboard() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [songData, setSongData] = useState({
    title: '',
    album: '',
    genre: '',
    duration: ''
  });

  const [songs, setSongs] = useState([]);
  const [message, setMessage] = useState('');

  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'artist') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!songData.title || !songData.album || !songData.genre || !songData.duration) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    const newSong = {
      id: Date.now(),
      ...songData,
      duration: `${songData.duration} segundos`
    };

    setSongs(prev => [newSong, ...prev]);
    setMessage('Canción agregada exitosamente');
    
    // Limpiar formulario
    setSongData({
      title: '',
      album: '',
      genre: '',
      duration: ''
    });

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setMessage(''), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSongData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isAuthenticated || user?.role !== 'artist') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Redirigiendo...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Dashboard del Artista
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Bienvenido, {user?.username}!
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
          color="error"
        >
          Cerrar Sesión
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Formulario para agregar canciones */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Agregar Nueva Canción
            </Typography>

            {message && (
              <Alert 
                severity={message.includes('exitosa') ? 'success' : 'error'} 
                sx={{ mb: 2 }}
              >
                {message}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Título de la canción"
                name="title"
                value={songData.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              
              <TextField
                label="Álbum"
                name="album"
                value={songData.album}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              
              <TextField
                label="Género"
                name="genre"
                value={songData.genre}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              
              <TextField
                label="Duración (segundos)"
                name="duration"
                type="number"
                value={songData.duration}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={<Add />}
                fullWidth
                sx={{ mt: 3 }}
                size="large"
              >
                Agregar Canción
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Lista de canciones agregadas */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Tus Canciones ({songs.length})
            </Typography>
            
            {songs.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                Aún no has agregado canciones
              </Typography>
            ) : (
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {songs.map((song) => (
                  <Card key={song.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" component="h3">
                        {song.title}
                      </Typography>
                      <Typography color="text.secondary">
                        Álbum: {song.album}
                      </Typography>
                      <Typography color="text.secondary">
                        Género: {song.genre}
                      </Typography>
                      <Typography color="text.secondary">
                        Duración: {song.duration}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}