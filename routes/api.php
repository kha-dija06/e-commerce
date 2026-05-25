<?php

// use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\Api\PasswordResetController;
// use App\Http\Controllers\Api\Admin\UserController;
// use App\Http\Controllers\Api\Admin\ProductController;
// use App\Http\Controllers\Api\Admin\OrderController;
// use App\Http\Controllers\Api\Admin\SupportController;
// use App\Http\Controllers\Api\Admin\AdminDashboardController;
// use App\Http\Controllers\Api\User\ProductPublicController;
// use App\Http\Controllers\Api\User\FavoriController;
// use App\Http\Controllers\Api\Admin\AdminCategoriesController;
// use App\Http\Controllers\Api\User\PanierController;
// use App\Http\Controllers\Api\User\CommandeController;
// use App\Http\Controllers\Api\User\SupportUserController;
// use App\Http\Controllers\Api\User\NotificationController;
// use Illuminate\Support\Facades\Route;

// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
// Route::post('/reset-password',  [PasswordResetController::class, 'resetPassword']);
// Route::post('/check-token',     [PasswordResetController::class, 'checkToken']);

// // Public routes (no auth)
// Route::get('/produits',          [ProductPublicController::class, 'index']);
// Route::get('/produits/vedettes', [ProductPublicController::class, 'vedettes']);
// Route::get('/produits/{id}',     [ProductPublicController::class, 'show']);
// Route::get('/categories',        [ProductPublicController::class, 'categories']);

// // Protected routes
// Route::middleware('auth:sanctum')->group(function () {

//     Route::post('/logout', [AuthController::class, 'logout']);
//     Route::get('/profile', [AuthController::class, 'profile']);
//     Route::put('/profile', [AuthController::class, 'updateProfile']);
//     Route::put('/change-password', [AuthController::class, 'changePassword']);

//     // Favorites
//     Route::get('/favorites',                        [FavoriController::class, 'index']);
//     Route::post('/favorites',                       [FavoriController::class, 'store']);
//     Route::delete('/favorites/{produit_id}',        [FavoriController::class, 'destroy']);
//     Route::get('/favorites/check/{produit_id}',     [FavoriController::class, 'check']);

//     // Cart
//     Route::get('/cart',                 [PanierController::class, 'index']);
//     Route::post('/cart',                [PanierController::class, 'store']);
//     Route::put('/cart/{produit_id}',    [PanierController::class, 'update']);
//     Route::delete('/cart/clear',        [PanierController::class, 'clear']);
//     Route::delete('/cart/{produit_id}', [PanierController::class, 'destroy']);

//     // Orders (user)
//     Route::get('/orders',               [CommandeController::class, 'index']);
//     Route::post('/orders',              [CommandeController::class, 'store']);
//     Route::get('/orders/{id}',          [CommandeController::class, 'show']);
//     Route::put('/orders/{id}/cancel',   [CommandeController::class, 'cancel']);

//     // Support (user)
//     Route::get('/support/tickets',  [SupportUserController::class, 'index']);
//     Route::post('/support/tickets', [SupportUserController::class, 'store']);
//     Route::get('/notifications', [NotificationController::class, 'index']);
// Route::get('/notifications',              [NotificationController::class, 'index']);
// Route::patch('/notifications/read-all',   [NotificationController::class, 'readAll']);
// Route::patch('/notifications/{id}/read',  [NotificationController::class, 'markRead']);
 

//     // Admin routes
//     Route::middleware('admin')->prefix('admin')->group(function () {

//         // Users
//         Route::get('/users',                    [UserController::class, 'index']);
//         Route::post('/users',                   [UserController::class, 'store']);
//         Route::put('/users/{id}',               [UserController::class, 'update']);
//         Route::patch('/users/{id}/statut',      [UserController::class, 'updateStatut']);
//         Route::delete('/users/{id}',            [UserController::class, 'destroy']);

//         // Dashboard
//         Route::get('/dashboard', [AdminDashboardController::class, 'index']);

//         // Products — ✅ no /categories here anymore, moved to AdminCategoriesController below
//         Route::get('/products',         [ProductController::class, 'index']);
//         Route::post('/products',        [ProductController::class, 'store']);
//         Route::put('/products/{id}',    [ProductController::class, 'update']);
//         Route::delete('/products/{id}', [ProductController::class, 'destroy']);

//         // Orders (admin) — ✅ export BEFORE {id} to avoid route conflict
//         Route::get('/orders/export/csv',        [OrderController::class, 'export']);
//         Route::get('/orders',                   [OrderController::class, 'index']);
//         Route::get('/orders/{id}',              [OrderController::class, 'show']);
//         Route::put('/orders/{id}/status',       [OrderController::class, 'updateStatus']);

//         // Support (admin)
//         Route::get('/support',                      [SupportController::class, 'index']);
//         Route::get('/support/stats',                [SupportController::class, 'stats']);
//         Route::get('/support/{id}',                 [SupportController::class, 'show']);
//         Route::patch('/support/{id}/statut',        [SupportController::class, 'updateStatut']);
//         Route::post('/support/{id}/reponses',       [SupportController::class, 'repondre']);
//         Route::delete('/support/{id}',              [SupportController::class, 'destroy']);

//         // ✅ Categories (admin) — AdminCategoriesController only, no duplicate
//         Route::get('/categories',           [AdminCategoriesController::class, 'index']);
//         Route::post('/categories',          [AdminCategoriesController::class, 'store']);
//         Route::put('/categories/{id}',   [AdminCategoriesController::class, 'update']); // ✅ PUT
//         Route::delete('/categories/{id}',   [AdminCategoriesController::class, 'destroy']);
//     });
// });

















use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\OrderController;
use App\Http\Controllers\Api\Admin\SupportController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\User\ProductPublicController;
use App\Http\Controllers\Api\User\FavoriController;
use App\Http\Controllers\Api\Admin\AdminCategoriesController;
use App\Http\Controllers\Api\User\PanierController;
use App\Http\Controllers\Api\User\CommandeController;
use App\Http\Controllers\Api\User\SupportUserController;
use App\Http\Controllers\Api\User\NotificationController;
use Illuminate\Support\Facades\Route;

// ── Auth public ──────────────────────────────────────────────────────────────
Route::post('/register',        [AuthController::class, 'register']);
Route::post('/login',           [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password',  [PasswordResetController::class, 'resetPassword']);
Route::post('/check-token',     [PasswordResetController::class, 'checkToken']);

// ── Produits publics (sans auth) ─────────────────────────────────────────────
Route::get('/produits',          [ProductPublicController::class, 'index']);
Route::get('/produits/vedettes', [ProductPublicController::class, 'vedettes']);
Route::get('/produits/{id}',     [ProductPublicController::class, 'show']);
Route::get('/categories',        [ProductPublicController::class, 'categories']);

// ── Routes protégées (auth:sanctum) ──────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Profile
    Route::post('/logout',           [AuthController::class, 'logout']);
    Route::get('/profile',           [AuthController::class, 'profile']);
    Route::put('/profile',           [AuthController::class, 'updateProfile']);
    Route::put('/change-password',   [AuthController::class, 'changePassword']);

    // Favoris
    Route::get('/favorites',                    [FavoriController::class, 'index']);
    Route::post('/favorites',                   [FavoriController::class, 'store']);
    Route::delete('/favorites/{produit_id}',    [FavoriController::class, 'destroy']);
    Route::get('/favorites/check/{produit_id}', [FavoriController::class, 'check']);

    // Panier
    Route::get('/cart',                 [PanierController::class, 'index']);
    Route::post('/cart',                [PanierController::class, 'store']);
    Route::put('/cart/{produit_id}',    [PanierController::class, 'update']);
    Route::delete('/cart/clear',        [PanierController::class, 'clear']);
    Route::delete('/cart/{produit_id}', [PanierController::class, 'destroy']);

    // Commandes (user)
    Route::get('/orders',             [CommandeController::class, 'index']);
    Route::post('/orders',            [CommandeController::class, 'store']);
    Route::get('/orders/{id}',        [CommandeController::class, 'show']);
    Route::put('/orders/{id}/cancel', [CommandeController::class, 'cancel']);

    // Support (user)
    Route::get('/support/tickets',  [SupportUserController::class, 'index']);
    Route::post('/support/tickets', [SupportUserController::class, 'store']);

    // ✅ Notifications — DANS le middleware auth:sanctum
    Route::get('/notifications',             [NotificationController::class, 'index']);
    Route::patch('/notifications/read-all',  [NotificationController::class, 'readAll']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead']);

    // ── Admin ────────────────────────────────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->group(function () {

        // Users
        Route::get('/users',               [UserController::class, 'index']);
        Route::post('/users',              [UserController::class, 'store']);
        Route::put('/users/{id}',          [UserController::class, 'update']);
        Route::patch('/users/{id}/statut', [UserController::class, 'updateStatut']);
        Route::delete('/users/{id}',       [UserController::class, 'destroy']);

        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Produits
        Route::get('/products',         [ProductController::class, 'index']);
        Route::post('/products',        [ProductController::class, 'store']);
        Route::put('/products/{id}',    [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Commandes admin — export AVANT {id} pour éviter conflict
        Route::get('/orders/export/csv',  [OrderController::class, 'export']);
        Route::get('/orders',             [OrderController::class, 'index']);
        Route::get('/orders/{id}',        [OrderController::class, 'show']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        // Support admin
        Route::get('/support',                [SupportController::class, 'index']);
        Route::get('/support/stats',          [SupportController::class, 'stats']);
        Route::get('/support/{id}',           [SupportController::class, 'show']);
        Route::patch('/support/{id}/statut',  [SupportController::class, 'updateStatut']);
        Route::post('/support/{id}/reponses', [SupportController::class, 'repondre']);
        Route::delete('/support/{id}',        [SupportController::class, 'destroy']);

        // Catégories admin
        Route::get('/categories',          [AdminCategoriesController::class, 'index']);
        Route::post('/categories',         [AdminCategoriesController::class, 'store']);
        Route::put('/categories/{id}',     [AdminCategoriesController::class, 'update']);
        Route::delete('/categories/{id}',  [AdminCategoriesController::class, 'destroy']);
    });
});

// use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\Api\PasswordResetController;
// use App\Http\Controllers\Api\Admin\UserController;
// use App\Http\Controllers\Api\Admin\ProductController;
// use App\Http\Controllers\Api\Admin\OrderController;
// use App\Http\Controllers\Api\Admin\SupportController;
// use App\Http\Controllers\Api\Admin\AdminDashboardController;
// use App\Http\Controllers\Api\User\ProductPublicController;
// use App\Http\Controllers\Api\User\FavoriController;  // ✅ Hna bdalt l namespace
// use App\Http\Controllers\Api\Admin\AdminCategoriesController;
// use App\Http\Controllers\Api\User\PanierController;
// use App\Http\Controllers\Api\User\CommandeController;
// use App\Http\Controllers\Api\User\SupportUserController;
// use Illuminate\Support\Facades\Route;

// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
// Route::post('/reset-password',  [PasswordResetController::class, 'resetPassword']);
// Route::post('/check-token',     [PasswordResetController::class, 'checkToken']);

// // ✅ Routes publiques — sans auth (visiteur)
// Route::get('/produits',          [ProductPublicController::class, 'index']);
// Route::get('/produits/vedettes', [ProductPublicController::class, 'vedettes']);
// Route::get('/produits/{id}',     [ProductPublicController::class, 'show']);
// Route::get('/categories',        [ProductPublicController::class, 'categories']);

// // Routes protégées (authentification requise)
// Route::middleware('auth:sanctum')->group(function () {

//     Route::post('/logout', [AuthController::class, 'logout']);
//     Route::get('/profile', [AuthController::class, 'profile']);
//     Route::put('/profile', [AuthController::class, 'updateProfile']);
//     Route::put('/change-password', [AuthController::class, 'changePassword']);
    
//     // ✅ Favorites routes (db l'namespace sahih)
//     Route::get('/favorites', [FavoriController::class, 'index']);
//     Route::post('/favorites', [FavoriController::class, 'store']);
//     Route::delete('/favorites/{produit_id}', [FavoriController::class, 'destroy']);
//     Route::get('/favorites/check/{produit_id}', [FavoriController::class, 'check']);
 

// // Cart
// Route::get('/cart',              [PanierController::class, 'index']);
// Route::post('/cart',             [PanierController::class, 'store']);
// Route::put('/cart/{produit_id}', [PanierController::class, 'update']);
// Route::delete('/cart/clear',     [PanierController::class, 'clear']);
// Route::delete('/cart/{produit_id}', [PanierController::class, 'destroy']);

// // Orders
// Route::get('/orders',       [CommandeController::class, 'index']);
// Route::post('/orders',      [CommandeController::class, 'store']);
// Route::get('/orders/{id}',  [CommandeController::class, 'show']);
// Route::put('/orders/{id}/cancel', [CommandeController::class, 'cancel']);


// Route::get('/support/tickets',  [SupportUserController::class, 'index']);
// Route::post('/support/tickets', [SupportUserController::class, 'store']);


//     Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
//         Route::get('/users', [UserController::class, 'index']);
//         Route::post('/users', [UserController::class, 'store']);
//         Route::put('/users/{id}', [UserController::class, 'update']);
//         Route::patch('/users/{id}/statut', [UserController::class, 'updateStatut']);
//         Route::delete('/users/{id}', [UserController::class, 'destroy']);
//         Route::get('/dashboard', [AdminDashboardController::class, 'index']);

//         // ✅ Routes admin produits/orders/support
//         Route::get('/products', [ProductController::class, 'index']);
//         Route::get('/categories', [ProductController::class, 'categories']);
//         Route::post('/products', [ProductController::class, 'store']);
//         Route::put('/products/{id}', [ProductController::class, 'update']);
//         Route::delete('/products/{id}', [ProductController::class, 'destroy']);

//         Route::get('/orders/export/csv', [OrderController::class, 'export']);
//         Route::get('/orders', [OrderController::class, 'index']);
//         Route::get('/orders/{id}', [OrderController::class, 'show']);
//         Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

//         Route::get('/support', [SupportController::class, 'index']);
//         Route::get('/support/stats', [SupportController::class, 'stats']);
//         Route::get('/support/{id}', [SupportController::class, 'show']);
//         Route::patch('/support/{id}/statut', [SupportController::class, 'updateStatut']);
//         Route::post('/support/{id}/reponses', [SupportController::class, 'repondre']);
//         Route::delete('/support/{id}', [SupportController::class, 'destroy']);

//         // ✅ Categories admin routes
//         Route::get('/categories',        [AdminCategoriesController::class, 'index']);
//         Route::post('/categories',       [AdminCategoriesController::class, 'store']);
//         Route::post('/categories/{id}',  [AdminCategoriesController::class, 'update']);
//         Route::delete('/categories/{id}',[AdminCategoriesController::class, 'destroy']);
//     });
// });

// use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\Api\PasswordResetController;
// use App\Http\Controllers\Api\Admin\UserController;
// use App\Http\Controllers\Api\Admin\ProductController;
// use App\Http\Controllers\Api\Admin\OrderController;
// use App\Http\Controllers\Api\Admin\SupportController;
// use App\Http\Controllers\Api\Admin\AdminDashboardController;
// use App\Http\Controllers\Api\User\ProductPublicController; // ✅ Ajouté

// use App\Http\Controllers\Api\FavoriController;
// use App\Http\Controllers\Api\Admin\AdminCategoriesController;
// use Illuminate\Support\Facades\Route;

// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
// Route::post('/reset-password',  [PasswordResetController::class, 'resetPassword']);
// Route::post('/check-token',     [PasswordResetController::class, 'checkToken']);

// // ✅ Routes publiques — sans auth (visiteur)
// Route::get('/produits',          [ProductPublicController::class, 'index']);
// Route::get('/produits/vedettes', [ProductPublicController::class, 'vedettes']);
// Route::get('/produits/{id}',     [ProductPublicController::class, 'show']);
// Route::get('/categories',        [ProductPublicController::class, 'categories']);

// // Routes protégées (authentification requise)
// Route::middleware('auth:sanctum')->group(function () {

//     Route::post('/logout', [AuthController::class, 'logout']);
//     Route::get('/profile', [AuthController::class, 'profile']);
//     Route::put('/profile', [AuthController::class, 'updateProfile']);
//     Route::put('/change-password', [AuthController::class, 'changePassword']);
//     Route::get('/favoris', [FavoriController::class, 'index']);
//     Route::post('/favoris', [FavoriController::class, 'store']);
//     Route::delete('/favoris/{produit_id}', [FavoriController::class, 'destroy']);
//     Route::get('/favoris/check/{produit_id}', [FavoriController::class, 'check']);

//     Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
//         Route::get('/users', [UserController::class, 'index']);
//         Route::post('/users', [UserController::class, 'store']);
//         Route::put('/users/{id}', [UserController::class, 'update']);
//         Route::patch('/users/{id}/statut', [UserController::class, 'updateStatut']);
//         Route::delete('/users/{id}', [UserController::class, 'destroy']);
//         Route::get('/dashboard', [AdminDashboardController::class, 'index']);

//         // ✅ Routes admin produits/orders/support
//         Route::get('/products', [ProductController::class, 'index']);
//         Route::get('/categories', [ProductController::class, 'categories']);
//         Route::post('/products', [ProductController::class, 'store']);
//         Route::put('/products/{id}', [ProductController::class, 'update']);
//         Route::delete('/products/{id}', [ProductController::class, 'destroy']);

//         Route::get('/orders/export/csv', [OrderController::class, 'export']);
//         Route::get('/orders', [OrderController::class, 'index']);
//         Route::get('/orders/{id}', [OrderController::class, 'show']);
//         Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

//         Route::get('/support', [SupportController::class, 'index']);
//         Route::get('/support/stats', [SupportController::class, 'stats']);
//         Route::get('/support/{id}', [SupportController::class, 'show']);
//         Route::patch('/support/{id}/statut', [SupportController::class, 'updateStatut']);
//         Route::post('/support/{id}/reponses', [SupportController::class, 'repondre']);
//         Route::delete('/support/{id}', [SupportController::class, 'destroy']);

       

// // F group admin
// Route::get('/categories',        [AdminCategoriesController::class, 'index']);
// Route::post('/categories',       [AdminCategoriesController::class, 'store']);
// Route::post('/categories/{id}',  [AdminCategoriesController::class, 'update']);
// Route::delete('/categories/{id}',[AdminCategoriesController::class, 'destroy']);
//     });

//     // Products pour users connectés
//     Route::get('/products', [ProductController::class, 'index']);
//     Route::post('/products', [ProductController::class, 'store']);
//     Route::put('/products/{id}', [ProductController::class, 'update']);
//     Route::delete('/products/{id}', [ProductController::class, 'destroy']);

//     Route::get('/orders/export/csv', [OrderController::class, 'export']);
//     Route::get('/orders', [OrderController::class, 'index']);
//     Route::get('/orders/{id}', [OrderController::class, 'show']);
//     Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

//     Route::get('/support', [SupportController::class, 'index']);
//     Route::get('/support/stats', [SupportController::class, 'stats']);
//     Route::get('/support/{id}', [SupportController::class, 'show']);
//     Route::patch('/support/{id}/statut', [SupportController::class, 'updateStatut']);
//     Route::post('/support/{id}/reponses', [SupportController::class, 'repondre']);
//     Route::delete('/support/{id}', [SupportController::class, 'destroy']);
// });