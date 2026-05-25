<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    // Etape 1 — B3t code 6 chiffres f email
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        // Securité — mana3trafch wach email kayna
        if (!$user) {
            return response()->json([
                'success' => true,
                'message' => 'Si cet email existe, un code a été envoyé'
            ]);
        }

        // Hbet token qdim
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Code 6 chiffres
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Khzen f database
        DB::table('password_reset_tokens')->insert([
            'email'      => $request->email,
            'token'      => Hash::make($code),
            'created_at' => Carbon::now()
        ]);

        // B3t email
        Mail::to($request->email)->send(new ResetPasswordMail($code, $user->name));

        return response()->json([
            'success' => true,
            'message' => 'Code envoyé à votre email',
        ]);
    }

    // Etape 2 — Verify code
    public function checkToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'Code invalide ou expiré'
            ], 400);
        }

        // Check expiry — 10 minutes
        $tokenAge = Carbon::parse($record->created_at)->diffInMinutes(Carbon::now());
        if ($tokenAge > 10) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'Code expiré, demandez un nouveau'
            ], 400);
        }

        if (!Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Code incorrect'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Code valide'
        ]);
    }

    // Etape 3 — Reset password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'token'    => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'Code invalide ou expiré'
            ], 400);
        }

        $tokenAge = Carbon::parse($record->created_at)->diffInMinutes(Carbon::now());
        if ($tokenAge > 10) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'Code expiré'
            ], 400);
        }

        if (!Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Code incorrect'
            ], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe modifié avec succès'
        ]);
    }
}

// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use App\Models\User;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Str;
// use Carbon\Carbon;

// class PasswordResetController extends Controller
// {
//     // Etape 1: User kiyb3t email → najem token w nkhaznoh f database
//     public function forgotPassword(Request $request)
//     {
//         $request->validate([
//             'email' => 'required|email'
//         ]);

//         // Check wach email kayna
//         $user = User::where('email', $request->email)->first();

//         // Hta ila makaynach user, nrj3o success (securité — maytm3rafch wach email kayna)
//         if (!$user) {
//             return response()->json([
//                 'success' => true,
//                 'message' => 'Ila kayn had email, wslak token d reset'
//             ]);
//         }

//         // Hbet token qdim ila kayn
//         DB::table('password_reset_tokens')->where('email', $request->email)->delete();

//         // Crear token jdid
//         $token = Str::random(64);

//         // Khzen token f database
//         DB::table('password_reset_tokens')->insert([
//             'email'      => $request->email,
//             'token'      => Hash::make($token),
//             'created_at' => Carbon::now()
//         ]);

//         // F production, hna katb3t email — daba kanarj3u token directly lil front
//         return response()->json([
//             'success' => true,
//             'message' => 'Token d reset t-créa b najah',
//             'data' => [
//                 'token' => $token,   // F production: hbet hada w b3t email
//                 'email' => $request->email
//             ]
//         ]);
//     }

//     // Etape 2: User kiyekhel token + password jdid
//     public function resetPassword(Request $request)
//     {
//         $request->validate([
//             'email'                 => 'required|email',
//             'token'                 => 'required|string',
//             'password'              => 'required|string|min:6|confirmed',
//         ]);

//         // Jib record mn database
//         $record = DB::table('password_reset_tokens')
//             ->where('email', $request->email)
//             ->first();

//         // Check wach token kayn
//         if (!$record) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Token invalide ou expiré'
//             ], 400);
//         }

//         // Check wach token machi expired (60 minutes)
//         $tokenAge = Carbon::parse($record->created_at)->diffInMinutes(Carbon::now());
//         if ($tokenAge > 60) {
//             DB::table('password_reset_tokens')->where('email', $request->email)->delete();
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Token expiré, b3t taleb jdid'
//             ], 400);
//         }

//         // Verify token
//         if (!Hash::check($request->token, $record->token)) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Token invalide'
//             ], 400);
//         }

//         // Bdel password
//         $user = User::where('email', $request->email)->first();
//         if (!$user) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Utilisateur introuvable'
//             ], 404);
//         }

//         $user->password = Hash::make($request->password);
//         $user->save();

//         // Hbet token mn database
//         DB::table('password_reset_tokens')->where('email', $request->email)->delete();

//         // Hbet toutes les sessions (tokens sanctum)
//         $user->tokens()->delete();

//         return response()->json([
//             'success' => true,
//             'message' => 'Mot de passe modifié avec succès, connectez-vous'
//         ]);
//     }

//     // Check wach token valid (optional — front kayb3t qbel ma yban form)
//     public function checkToken(Request $request)
//     {
//         $request->validate([
//             'email' => 'required|email',
//             'token' => 'required|string',
//         ]);

//         $record = DB::table('password_reset_tokens')
//             ->where('email', $request->email)
//             ->first();

//         if (!$record) {
//             return response()->json(['success' => false, 'message' => 'Token invalide'], 400);
//         }

//         $tokenAge = Carbon::parse($record->created_at)->diffInMinutes(Carbon::now());
//         if ($tokenAge > 60) {
//             return response()->json(['success' => false, 'message' => 'Token expiré'], 400);
//         }

//         if (!Hash::check($request->token, $record->token)) {
//             return response()->json(['success' => false, 'message' => 'Token invalide'], 400);
//         }

//         return response()->json(['success' => true, 'message' => 'Token valide']);
//     }
// }
