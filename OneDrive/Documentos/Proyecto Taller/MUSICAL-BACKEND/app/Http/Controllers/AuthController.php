<?php

namespace App\Http\Controllers;

use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    private $secret;

    public function __construct()
    {
        // ✅ CORREGIDO: Usar JWT_SECRET en lugar de app.key
        $this->secret = env('JWT_SECRET');
    }

    public function register(Request $request)
    {
        try {
            Log::info('Register attempt', $request->all());

            $request->validate([
                'name' => 'required|string',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
                'role' => 'required|in:user,artist,admin'
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role
            ]);

            $payload = [
                'sub' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'iat' => time(),
                'exp' => time() + 3600
            ];

            // ✅ CORREGIDO: Usando la misma JWT_SECRET que el middleware
            $token = JWT::encode($payload, $this->secret, 'HS256');

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ],
                'token' => $token
            ], 201);

        } catch (Exception $e) {
            Log::error('Register error: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno del servidor: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            Log::info('Login attempt', $request->all());

            $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Credenciales inválidas'], 401);
            }

            $payload = [
                'sub' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'iat' => time(),
                'exp' => time() + 3600
            ];

            // ✅ CORREGIDO: Usando la misma JWT_SECRET que el middleware
            $token = JWT::encode($payload, $this->secret, 'HS256');

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ],
                'token' => $token
            ]);

        } catch (Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }

    public function perfil(Request $request)
    {
        try {
            // ✅ CORREGIDO: Usar auth()->user() en lugar de decodificar manualmente
            $user = auth()->user();
            
            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Token inválido o expirado'], 403);
        }
    }
}