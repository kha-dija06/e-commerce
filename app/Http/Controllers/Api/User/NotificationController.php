<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    // GET /api/notifications
    public function index()
    {
        $user = Auth::user();

        $notifications = $user->notifications()  // ✅ Laravel built-in
            ->take(8)
            ->get()
            ->map(function ($n) {
                $diff = now()->diffInMinutes($n->created_at);
                return [
                    'id'         => $n->id,
                    'type'       => $n->data['type'] ?? 'order',
                    'text'       => $n->data['text'] ?? '',
                    'read'       => $n->read_at !== null,
                    'time_label' => match(true) {
                        $diff < 1    => 'À l\'instant',
                        $diff < 60   => "Il y a {$diff} min",
                        $diff < 1440 => 'Il y a ' . floor($diff / 60) . 'h',
                        default      => 'Il y a ' . floor($diff / 1440) . ' jour(s)',
                    },
                ];
            });

        return response()->json([
            'success' => true,
            'data'    => $notifications,
        ]);
    }

    // PATCH /api/notifications/read-all
    public function readAll()
    {
        Auth::user()->unreadNotifications->markAsRead(); // ✅ Laravel built-in

        return response()->json([
            'success' => true,
            'message' => 'Toutes les notifications marquées comme lues',
        ]);
    }

    // PATCH /api/notifications/{id}/read
    public function markRead(string $id)
    {
        $notif = Auth::user()->notifications()->findOrFail($id);
        $notif->markAsRead(); // ✅ Laravel built-in

        return response()->json(['success' => true]);
    }
}