<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['error' => 'Token no proporcionado'], 401);
            }

            $secret = env('JWT_SECRET');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            
            $user = \App\Models\User::find($decoded->sub);
            
            if (!$user) {
                return response()->json(['error' => 'Usuario no encontrado'], 401);
            }

            auth()->setUser($user);

            return $next($request);

        } catch (Exception $e) {
            return response()->json(['error' => 'Token inválido o expirado: ' . $e->getMessage()], 401);
        }
    }
}