<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * GET /api/admin/dashboard?range=daily|weekly|monthly
     */
    public function index(Request $request)
    {
        $range = $request->query('range', 'monthly');

        return response()->json([
            'stats'           => $this->getStats(),
            'sales_chart'     => $this->getSalesChart($range),
            'categories'      => $this->getCategoryDistribution(),
            'best_sellers'    => $this->getBestSellers(),
            'recent_activity' => $this->getRecentActivity(),
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 1. KPI STATS
    // ─────────────────────────────────────────────────────────────────────────
    private function getStats(): array
    {
        $now        = Carbon::now();
        $startMonth = $now->copy()->startOfMonth();
        $startPrev  = $now->copy()->subMonth()->startOfMonth();
        $endPrev    = $now->copy()->subMonth()->endOfMonth();

        // ── Ventes totales ──
        $totalSales     = DB::table('commandes')->whereNotIn('statut', ['annulee'])->sum('total');
        $salesThisMonth = DB::table('commandes')->whereNotIn('statut', ['annulee'])->where('created_at', '>=', $startMonth)->sum('total');
        $salesLastMonth = DB::table('commandes')->whereNotIn('statut', ['annulee'])->whereBetween('created_at', [$startPrev, $endPrev])->sum('total');

        // ── Commandes ──
        $ordersCount     = DB::table('commandes')->count();
        $ordersThisMonth = DB::table('commandes')->where('created_at', '>=', $startMonth)->count();
        $ordersLastMonth = DB::table('commandes')->whereBetween('created_at', [$startPrev, $endPrev])->count();

        // ── Tous les produits ──
        $productsCount = DB::table('produits')->count();
        $productsNew   = DB::table('produits')->where('created_at', '>=', $startMonth)->count();

        // ── Utilisateurs seulement (role = utilisateur, pas les admins) ──
        $usersCount     = DB::table('users')->where('role', 'utilisateur')->count();
        $usersThisMonth = DB::table('users')->where('role', 'utilisateur')->where('created_at', '>=', $startMonth)->count();
        $usersLastMonth = DB::table('users')->where('role', 'utilisateur')->whereBetween('created_at', [$startPrev, $endPrev])->count();

        return [
            'total_sales'     => round((float) $totalSales, 2),
            'orders_count'    => $ordersCount,
            'products_count'  => $productsCount,
            'users_count'     => $usersCount,
            'sales_growth'    => $this->growthPercent($salesLastMonth, $salesThisMonth),
            'orders_growth'   => $this->growthPercent($ordersLastMonth, $ordersThisMonth),
            'products_growth' => ($productsNew > 0 ? '+' : '') . $productsNew,
            'users_growth'    => $this->growthPercent($usersLastMonth, $usersThisMonth),
        ];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. SALES CHART
    // ─────────────────────────────────────────────────────────────────────────
    private function getSalesChart(string $range): array
    {
        $periods = [];

        switch ($range) {
            case 'daily':
                for ($i = 6; $i >= 0; $i--) {
                    $day = Carbon::now()->subDays($i);
                    $periods[] = [
                        'label' => $day->format('d/m'),
                        'start' => $day->copy()->startOfDay(),
                        'end'   => $day->copy()->endOfDay(),
                    ];
                }
                break;

            case 'weekly':
                for ($i = 6; $i >= 0; $i--) {
                    $week = Carbon::now()->subWeeks($i);
                    $periods[] = [
                        'label' => 'S' . $week->weekOfYear,
                        'start' => $week->copy()->startOfWeek(),
                        'end'   => $week->copy()->endOfWeek(),
                    ];
                }
                break;

            default: // monthly
                for ($i = 6; $i >= 0; $i--) {
                    $month = Carbon::now()->subMonths($i);
                    $periods[] = [
                        'label' => $month->locale('fr')->translatedFormat('M'),
                        'start' => $month->copy()->startOfMonth(),
                        'end'   => $month->copy()->endOfMonth(),
                    ];
                }
        }

        return array_map(function ($period) {
            $sales = DB::table('commandes')
                ->whereNotIn('statut', ['annulee'])
                ->whereBetween('created_at', [$period['start'], $period['end']])
                ->sum('total');

            $orders = DB::table('commandes')
                ->whereBetween('created_at', [$period['start'], $period['end']])
                ->count();

            return [
                'name'   => $period['label'],
                'sales'  => round((float) $sales, 2),
                'orders' => $orders,
            ];
        }, $periods);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. CATEGORY DISTRIBUTION
    // Fallback : si pas de ventes, compte les produits par catégorie
    // ─────────────────────────────────────────────────────────────────────────
    private function getCategoryDistribution(): array
    {
        // Essai avec les ventes réelles
        $rows = DB::table('lignes_commande as lc')
            ->join('produits as p', 'p.id', '=', 'lc.produit_id')
            ->join('categories as c', 'c.id', '=', 'p.categorie_id')
            ->join('commandes as cmd', 'cmd.id', '=', 'lc.commande_id')
            ->whereNotIn('cmd.statut', ['annulee'])
            ->select('c.nom', DB::raw('SUM(lc.quantite * lc.prix) as total'))
            ->groupBy('c.id', 'c.nom')
            ->orderByDesc('total')
            ->get();

        $grandTotal = $rows->sum('total');

        // Fallback : pas de ventes → compter les produits par catégorie
        if ($grandTotal == 0) {
            $rows = DB::table('produits as p')
                ->join('categories as c', 'c.id', '=', 'p.categorie_id')
                ->select('c.nom', DB::raw('COUNT(p.id) as total'))
                ->groupBy('c.id', 'c.nom')
                ->orderByDesc('total')
                ->get();

            $grandTotal = $rows->sum('total');
            if ($grandTotal == 0) return [];
        }

        return $rows->map(fn($row) => [
            'name'  => $row->nom,
            'value' => round(($row->total / $grandTotal) * 100),
        ])->values()->toArray();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. BEST SELLERS
    // Fallback : si pas de ventes, affiche les produits les plus chers
    // ─────────────────────────────────────────────────────────────────────────
    private function getBestSellers(): array
    {
        // Essai avec les ventes réelles
        $rows = DB::table('lignes_commande as lc')
            ->join('produits as p', 'p.id', '=', 'lc.produit_id')
            ->join('commandes as cmd', 'cmd.id', '=', 'lc.commande_id')
            ->whereNotIn('cmd.statut', ['annulee'])
            ->select(
                'p.id',
                'p.nom as name',
                'p.image',
                'p.prix',
                DB::raw('SUM(lc.quantite) as sales'),
                DB::raw('SUM(lc.quantite * lc.prix) as revenue')
            )
            ->groupBy('p.id', 'p.nom', 'p.image', 'p.prix')
            ->orderByDesc('sales')
            ->limit(5)
            ->get();

        // Fallback : pas de ventes → top 5 produits par prix
        if ($rows->isEmpty()) {
            $rows = DB::table('produits')
                ->select(
                    'id',
                    'nom as name',
                    'image',
                    'prix',
                    DB::raw('0 as sales'),
                    DB::raw('0 as revenue')
                )
                ->orderByDesc('prix')
                ->limit(5)
                ->get();
        }

        $prevMonth = Carbon::now()->subMonth();

        return $rows->map(function ($row) use ($prevMonth) {
            $thisMonth = DB::table('lignes_commande as lc')
                ->join('commandes as cmd', 'cmd.id', '=', 'lc.commande_id')
                ->where('lc.produit_id', $row->id)
                ->whereNotIn('cmd.statut', ['annulee'])
                ->where('cmd.created_at', '>=', Carbon::now()->startOfMonth())
                ->sum('lc.quantite');

            $lastMonth = DB::table('lignes_commande as lc')
                ->join('commandes as cmd', 'cmd.id', '=', 'lc.commande_id')
                ->where('lc.produit_id', $row->id)
                ->whereNotIn('cmd.statut', ['annulee'])
                ->whereBetween('cmd.created_at', [
                    $prevMonth->copy()->startOfMonth(),
                    $prevMonth->copy()->endOfMonth(),
                ])
                ->sum('lc.quantite');

            // URL image
            $image = null;
            if ($row->image) {
                $image = str_starts_with($row->image, 'http')
                    ? $row->image
                    : asset('storage/' . $row->image);
            }

            return [
                'id'      => $row->id,
                'name'    => $row->name,
                'image'   => $image,
                'sales'   => (int) $row->sales,
                'revenue' => round((float) ($row->revenue ?: $row->prix), 2),
                'growth'  => $this->growthPercent($lastMonth, $thisMonth),
            ];
        })->values()->toArray();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 5. RECENT ACTIVITY
    // Commandes + utilisateurs (role=utilisateur seulement) + produits récents
    // ─────────────────────────────────────────────────────────────────────────
    private function getRecentActivity(): array
    {
        $events = collect();

        // Nouvelles commandes
        $orders = DB::table('commandes as c')
            ->join('users as u', 'u.id', '=', 'c.utilisateur_id')
            ->select('c.created_at', 'u.name', 'c.statut')
            ->orderByDesc('c.created_at')
            ->limit(5)
            ->get();

        foreach ($orders as $o) {
            $events->push([
                'created_at' => $o->created_at,
                'action'     => 'Nouvelle commande',
                'user'       => $o->name,
                'status'     => 'success',
            ]);
        }

        // Nouveaux utilisateurs (role = utilisateur seulement, pas les admins)
        $users = DB::table('users')
            ->where('role', 'utilisateur')
            ->select('created_at', 'name')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        foreach ($users as $u) {
            $events->push([
                'created_at' => $u->created_at,
                'action'     => 'Nouvel utilisateur',
                'user'       => $u->name,
                'status'     => 'info',
            ]);
        }

        // Produits récemment ajoutés/modifiés
        $produits = DB::table('produits')
            ->select('updated_at as created_at', 'nom as name', 'statut')
            ->orderByDesc('updated_at')
            ->limit(4)
            ->get();

        foreach ($produits as $p) {
            $action = match($p->statut) {
                'rupture_stock' => 'Produit épuisé',
                'abandonne'     => 'Produit désactivé',
                default         => 'Produit mis à jour',
            };
            $events->push([
                'created_at' => $p->created_at,
                'action'     => $action,
                'user'       => $p->name,
                'status'     => $p->statut === 'rupture_stock' ? 'warning' : 'info',
            ]);
        }

        return $events
            ->sortByDesc('created_at')
            ->take(10)
            ->values()
            ->map(function ($event) {
                $diff = Carbon::parse($event['created_at'])->diffForHumans(null, true);
                return [
                    'time'   => 'Il y a ' . $diff,
                    'action' => $event['action'],
                    'user'   => $event['user'],
                    'status' => $event['status'],
                ];
            })
            ->toArray();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPER
    // ─────────────────────────────────────────────────────────────────────────
    private function growthPercent($previous, $current): string
    {
        if ($previous == 0) {
            return $current > 0 ? '+100%' : '0%';
        }
        $pct = round((($current - $previous) / $previous) * 100, 1);
        return ($pct >= 0 ? '+' : '') . $pct . '%';
    }
}
