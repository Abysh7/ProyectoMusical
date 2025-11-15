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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert
} from '@mui/material';
import { Search, Favorite, Logout, PlayArrow } from '@mui/icons-material';
import styled from 'styled-components';

// 🎨 STYLED COMPONENTS
const StyledContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const StyledPaper = styled(Paper)`
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const SearchPaper = styled(Paper)`
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 8px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const ResultsContainer = styled(Box)`
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ActionButton = styled(Button)`
  margin-left: 0.5rem !important;
`;

export default function UserDashboard() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('song');
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');
  
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setMessage('Por favor ingresa un término de búsqueda');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Simulación de resultados de búsqueda
    const mockResults = [
      {
        id: '1',
        title: `Canción sobre ${searchQuery}`,
        artist: 'Artista Ejemplo',
        album: 'Álbum Demo',
        duration: 180,
        genre: 'Pop'
      },
      {
        id: '2', 
        title: `Otra canción de ${searchQuery}`,
        artist: 'Artista Demo',
        album: 'Colección 2024',
        duration: 210,
        genre: 'Rock'
      },
      {
        id: '3',
        title: `${searchQuery} Hits`,
        artist: 'Banda Internacional',
        album: 'Grandes Éxitos',
        duration: 195,
        genre: 'Pop Rock'
      }
    ];

    setSearchResults(mockResults);
    setMessage(`Encontrados ${mockResults.length} resultados para "${searchQuery}"`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddToFavorites = (song) => {
    if (!favorites.find(fav => fav.id === song.id)) {
      setFavorites(prev => [...prev, song]);
      setMessage(`"${song.title}" agregada a favoritos`);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Esta canción ya está en tus favoritos');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRemoveFavorite = (songId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== songId));
    setMessage('Canción eliminada de favoritos');
    setTimeout(() => setMessage(''), 3000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Redirigiendo...</Typography>
      </Box>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      {/* Header con gradiente */}
      <StyledPaper elevation={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Dashboard Musical
            </Typography>
            <Typography variant="h6">
              Bienvenido, {user?.username}!
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </StyledPaper>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Panel de Búsqueda */}
        <Grid item xs={12} md={8}>
          <SearchPaper elevation={2}>
            <Typography variant="h5" component="h2" gutterBottom>
              Buscar Música
            </Typography>

            {message && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            <SearchForm onSubmit={handleSearch}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  label="Tipo"
                >
                  <MenuItem value="song">Canciones</MenuItem>
                  <MenuItem value="artist">Artistas</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label={`Buscar ${searchType === 'song' ? 'canciones' : 'artistas'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flex: 1 }}
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={<Search />}
                size="large"
              >
                Buscar
              </Button>
            </SearchForm>

            {/* Resultados de Búsqueda */}
            {searchResults.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Resultados de Búsqueda ({searchResults.length})
                </Typography>
                <ResultsContainer>
                  {searchResults.map(song => (
                    <StyledCard key={song.id} elevation={1}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box flex={1}>
                            <Typography variant="h6" component="h3" gutterBottom>
                              {song.title}
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                              {song.artist} • {song.album}
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center">
                              <Chip label={song.genre} size="small" />
                              <Typography variant="body2" color="text.secondary">
                                {formatDuration(song.duration)}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <ActionButton
                              variant="outlined"
                              startIcon={<Favorite />}
                              onClick={() => handleAddToFavorites(song)}
                              size="small"
                            >
                              Favorito
                            </ActionButton>
                            <ActionButton
                              variant="contained"
                              startIcon={<PlayArrow />}
                              size="small"
                            >
                              Reproducir
                            </ActionButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  ))}
                </ResultsContainer>
              </Box>
            )}
          </SearchPaper>
        </Grid>

        {/* Panel de Favoritos */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Mis Favoritos ({favorites.length})
            </Typography>

            {favorites.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                Aún no tienes canciones favoritas
              </Typography>
            ) : (
              <ResultsContainer>
                {favorites.map(song => (
                  <StyledCard key={song.id} elevation={1}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {song.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {song.artist}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFavorite(song.id)}
                        sx={{ mt: 1 }}
                      >
                        Eliminar
                      </Button>
                    </CardContent>
                  </StyledCard>
                ))}
              </ResultsContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}