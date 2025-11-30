<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SongController;
use App\Http\Controllers\FavoriteController; 

// RUTAS PÚBLICAS (sin autenticación)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// ✅ CORREGIDO: Cambiar 'auth:api' por 'jwt.auth' para JWT
Route::middleware('jwt.auth')->group(function () {
    // PERFIL protegido
    Route::get('/perfil', [AuthController::class, 'perfil']);
    
    // RUTAS DE CANCIONES
    Route::get('/songs', [SongController::class, 'index']);           // GET /api/songs - Listar canciones
    Route::post('/songs', [SongController::class, 'store']);          // POST /api/songs - Crear canción
    Route::delete('/songs/{id}', [SongController::class, 'destroy']); // DELETE /api/songs/{id} - Eliminar canción
    
    // RUTAS DE BÚSQUEDA
    Route::get('/songs/search', [SongController::class, 'searchSongs']);              // GET /api/songs/search?q=termino
    Route::get('/artist/{artistName}/albums', [SongController::class, 'getArtistAlbums']); // GET /api/artist/Queen/albums
    Route::get('/artist/{artistName}/album/{albumName}/songs', [SongController::class, 'getAlbumSongs']); // GET /api/artist/Queen/album/A%20Night%20at%20the%20Opera/songs
    
    // RUTAS DE FAVORITOS
    Route::get('/user/favorites', [FavoriteController::class, 'getUserFavorites']);
    Route::post('/user/favorites/{songId}', [FavoriteController::class, 'addToFavorites']);
    Route::delete('/user/favorites/{songId}', [FavoriteController::class, 'removeFromFavorites']);
});