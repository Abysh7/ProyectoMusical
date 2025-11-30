<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    /**
     * Obtener todas las canciones favoritas del usuario
     */
    public function getUserFavorites(Request $request)
    {
        try {
            $user = auth()->user(); // ✅ CAMBIADO
            
            $favorites = $user->favoriteSongs()->get();

            return response()->json($favorites);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener favoritos'], 500);
        }
    }

    /**
     * Agregar canción a favoritos
     */
    public function addToFavorites(Request $request, $songId)
    {
        try {
            $user = auth()->user(); // ✅ CAMBIADO
            $song = Song::find($songId);

            if (!$song) {
                return response()->json(['error' => 'Canción no encontrada'], 404);
            }

            // Agregar a favoritos (evita duplicados)
            $user->favoriteSongs()->syncWithoutDetaching([$songId]);

            return response()->json([
                'message' => 'Canción agregada a favoritos',
                'song' => $song
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al agregar a favoritos'], 500);
        }
    }

    /**
     * Quitar canción de favoritos
     */
    public function removeFromFavorites(Request $request, $songId)
    {
        try {
            $user = auth()->user(); // ✅ CAMBIADO
            $song = Song::find($songId);

            if (!$song) {
                return response()->json(['error' => 'Canción no encontrada'], 404);
            }

            // Quitar de favoritos
            $user->favoriteSongs()->detach($songId);

            return response()->json([
                'message' => 'Canción eliminada de favoritos'
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar de favoritos'], 500);
        }
    }
}