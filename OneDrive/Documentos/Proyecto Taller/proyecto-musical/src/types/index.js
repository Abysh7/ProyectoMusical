// Estructuras de datos para nuestra aplicación musical

// Roles de usuario
export const UserRoles = {
  USER: 'user',
  ARTIST: 'artist'
};

// Estructura de una canción
export const createSong = (songData) => ({
  id: songData?.id || '',
  title: songData?.title || '',
  artist: songData?.artist || '',
  album: songData?.album || '',
  duration: songData?.duration || 0,
  genre: songData?.genre || '',
  fileUrl: songData?.fileUrl || ''
});

// Estructura de un álbum
export const createAlbum = (albumData) => ({
  id: albumData?.id || '',
  title: albumData?.title || '',
  artist: albumData?.artist || '',
  year: albumData?.year || 2024,
  songs: albumData?.songs || []
});

// Estructura de usuario
export const createUser = (userData) => ({
  id: userData?.id || '',
  username: userData?.username || '',
  email: userData?.email || '',
  role: userData?.role || UserRoles.USER,
  favoriteSongs: userData?.favoriteSongs || []
});