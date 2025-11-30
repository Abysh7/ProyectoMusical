<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SongController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $songs = Song::all();
        return response()->json($songs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // 🟡 DEBUG TEMPORAL - INICIO (QUITAR DESPUÉS)
            Log::info('=== DEBUG STORE METHOD ===');
            Log::info('Request data:', $request->all());
            Log::info('User authenticated:', ['is_authenticated' => auth()->check()]);
            Log::info('User object:', auth()->user() ? ['id' => auth()->user()->id, 'name' => auth()->user()->name] : 'NULL_USER');
            Log::info('Headers:', $request->headers->all());
            // 🟡 DEBUG TEMPORAL - FIN (QUITAR DESPUÉS)

            Log::info('Creating song', $request->all());

            $request->validate([
                'title' => 'required|string',
                'artist' => 'required|string',
                'album' => 'required|string',
                'genre' => 'required|string',
                'duration' => 'required|integer',
            ]);

            $song = Song::create([
                'title' => $request->title,
                'artist' => $request->artist,
                'album' => $request->album,
                'genre' => $request->genre,
                'duration' => $request->duration,
                'user_id' => auth()->user()->id, // ✅ CORREGIDO: Para JWT
            ]);

            return response()->json($song, 201);

        } catch (\Exception $e) {
            // 🟡 DEBUG TEMPORAL - INICIO (QUITAR DESPUÉS)
            Log::error('=== DEBUG ERROR DETAILS ===');
            Log::error('Error message: ' . $e->getMessage());
            Log::error('Error file: ' . $e->getFile());
            Log::error('Error line: ' . $e->getLine());
            Log::error('Error trace: ' . $e->getTraceAsString());
            // 🟡 DEBUG TEMPORAL - FIN (QUITAR DESPUÉS)
            
            Log::error('Error creating song: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Error real del backend: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $song = Song::find($id);
        if (!$song) {
            return response()->json(['error' => 'Canción no encontrada'], 404);
        }
        return response()->json($song);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $song = Song::find($id);
            if (!$song) {
                return response()->json(['error' => 'Canción no encontrada'], 404);
            }

            $song->update($request->all());
            return response()->json($song);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar la canción'], 500);
        }
    }

    /**
     * Remove the specified resource in storage.
     */
    public function destroy(string $id)
    {
        try {
            $song = Song::find($id);
            if (!$song) {
                return response()->json(['error' => 'Canción no encontrada'], 404);
            }

            $song->delete();
            return response()->json(null, 204);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar la canción'], 500);
        }
    }

    // ✅ NUEVO MÉTODO: Búsqueda de canciones
    public function searchSongs(Request $request)
    {
        try {
            $query = $request->get('q', '');
            
            Log::info('Búsqueda de canciones', ['query' => $query]);

            if (empty($query)) {
                return response()->json([]);
            }

            // Buscar en título, artista, álbum y género
            $songs = Song::where('title', 'LIKE', "%{$query}%")
                        ->orWhere('artist', 'LIKE', "%{$query}%")
                        ->orWhere('album', 'LIKE', "%{$query}%")
                        ->orWhere('genre', 'LIKE', "%{$query}%")
                        ->get();

            Log::info('Resultados de búsqueda', ['count' => $songs->count()]);

            return response()->json($songs);

        } catch (\Exception $e) {
            Log::error('Error en búsqueda de canciones: ' . $e->getMessage());
            return response()->json(['error' => 'Error en la búsqueda: ' . $e->getMessage()], 500);
        }
    }

    // ✅ NUEVO MÉTODO: Obtener álbumes de un artista
    public function getArtistAlbums(Request $request, $artistName)
    {
        try {
            Log::info('Obteniendo álbumes del artista', ['artist' => $artistName]);

            $albums = Song::where('artist', $artistName)
                          ->select('album')
                          ->distinct()
                          ->get()
                          ->pluck('album');

            return response()->json($albums);

        } catch (\Exception $e) {
            Log::error('Error obteniendo álbumes: ' . $e->getMessage());
            return response()->json(['error' => 'Error al obtener álbumes'], 500);
        }
    }

    // ✅ NUEVO MÉTODO: Obtener canciones de un álbum
    public function getAlbumSongs(Request $request, $artistName, $albumName)
    {
        try {
            Log::info('Obteniendo canciones del álbum', [
                'artist' => $artistName,
                'album' => $albumName
            ]);

            $songs = Song::where('artist', $artistName)
                         ->where('album', $albumName)
                         ->get();

            return response()->json($songs);

        } catch (\Exception $e) {
            Log::error('Error obteniendo canciones del álbum: ' . $e->getMessage());
            return response()->json(['error' => 'Error al obtener canciones del álbum'], 500);
        }
    }
}