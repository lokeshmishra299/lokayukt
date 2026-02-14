<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$params): Response
    { 
     
        // if (!Auth::check()) {
        //     return redirect('/admin/login');
        // }

        // $userRole = Auth::user()->role->name ?? null; // ✅ updated line
        // if (!$userRole) {
        //     abort(403, 'No role assigned to user.');
        // }

        // if (in_array($userRole, $roles)) {
        //     return $next($request);
        // }

        // abort(403, 'Unauthorized access.');
          if (!Auth::check()) {
            return $request->expectsJson()
                ? response()->json(['error' => 'Unauthorized'], 401)
                : redirect('/login');
        }

        $user = Auth::user();
        $userRole = $user->role->name ?? null;
        $userSubRole = $user->subrole->name ?? null; // assumes relation exists

    
        if (!$userRole) {
            abort(403, 'No role assigned.');
        }


         $roleMap = [];
        foreach ($params as $param) {
            $parts = explode(':', $param, 2);
            $roleKey = strtolower(trim($parts[0]));

            $subRoles = [];
            if (isset($parts[1])) {
                $subRoles = array_map('strtolower', array_map('trim', explode('|', $parts[1])));
            }

            $roleMap[$roleKey] = $subRoles;
        }

        // Debugging (you can comment this later)
        // dd($userRole, $roleMap);

        // ✅ Check authorization
        foreach ($roleMap as $role => $subRoles) {
            if ($userRole === $role) {
                if (empty($subRoles) || in_array($userSubRole, $subRoles)) {
                    return $next($request);
                }
            }
        }

        abort(403, 'Unauthorized access.');
    }
}
