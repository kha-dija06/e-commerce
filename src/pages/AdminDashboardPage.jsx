import { useTranslation } from 'react-i18next';
import { Package, ShoppingBag, Users, ArrowUpRight, DollarSign, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useState, useEffect } from 'react';
import api from '../services/api'; // ✅ utilise ton instance axios existante (token géré automatiquement)

// ─── Category color map (matches your DB categories) ─────────────────────────
const CATEGORY_COLORS = {
  'Bijoux Marocains': '#8b5cf6',
  'Produits Naturels': '#10b981',
  'Artisanat et Décoration Marocaine': '#3b82f6',
  'Tapis et Tissage Marocain': '#f59e0b',
};
const FALLBACK_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboardPage = () => {
  const { t, i18n } = useTranslation();
  const [timeRange, setTimeRange] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── State for each data block ──
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // ── RTL support for Arabic ────
  const isRtl = i18n.language === 'ar';

  // ─────────────────────────────────────────────────────────────────────────────
  // Fetch all dashboard data from Laravel API
  // Expected endpoint: GET /api/admin/dashboard?range=monthly|weekly|daily
  //
  // If your back-end returns a single /admin/dashboard endpoint, adapt the
  // destructuring below.  Alternatively split into multiple endpoints.
  //
  // Expected response shape:
  // {
  //   stats: { total_sales, orders_count, products_count, users_count,
  //            sales_growth, orders_growth, products_growth, users_growth },
  //   sales_chart: [{ name: "Jan", sales: 4000, orders: 240 }, ...],
  //   categories:  [{ name: "Tapis...", value: 45 }, ...],
  //   best_sellers:[{ name, sales, revenue, image }],
  //   recent_activity: [{ time, action, user, status }]
  // }
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/admin/dashboard', {
          params: { range: timeRange },
        });

        // ── Stats ──
        setStats({
          totalSales: data.stats?.total_sales ?? 0,
          ordersCount: data.stats?.orders_count ?? 0,
          productsCount: data.stats?.products_count ?? 0,
          usersCount: data.stats?.users_count ?? 0,
          salesGrowth: data.stats?.sales_growth ?? '+0%',
          ordersGrowth: data.stats?.orders_growth ?? '+0%',
          productsGrowth: data.stats?.products_growth ?? '+0',
          usersGrowth: data.stats?.users_growth ?? '+0%',
        });

        // ── Sales chart ──
        setSalesData(data.sales_chart ?? []);

        // ── Category distribution ──
        const cats = (data.categories ?? []).map((cat, i) => ({
          ...cat,
          color: CATEGORY_COLORS[cat.name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
        }));
        setCategoryData(cats);

        // ── Best sellers ──
        setBestSellers(data.best_sellers ?? []);

        // ── Recent activity ──
        setRecentActivity(data.recent_activity ?? []);
      } catch (err) {
        console.error('Dashboard API error:', err);
        setError(err?.response?.data?.message || t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [timeRange, t]);

  // ── Format currency in DH ──
  const formatDH = (value) =>
    new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 0 }).format(value) + ' DH';

  // ── Stat cards config (driven by API data) ──
  const statCards = stats
    ? [
        {
          label: t('admin.total_sales'),
          value: formatDH(stats.totalSales),
          icon: DollarSign,
          color: 'emerald',
          growth: stats.salesGrowth,
        },
        {
          label: t('admin.orders', 'Commandes'),
          value: stats.ordersCount.toLocaleString(),
          icon: ShoppingBag,
          color: 'blue',
          growth: stats.ordersGrowth,
        },
        {
          label: t('admin.products', 'Produits'),
          value: stats.productsCount.toLocaleString(),
          icon: Package,
          color: 'amber',
          growth: stats.productsGrowth,
        },
        {
          label: t('admin.users', 'Utilisateurs'),
          value: stats.usersCount.toLocaleString(),
          icon: Users,
          color: 'purple',
          growth: stats.usersGrowth,
        },
      ]
    : [];

  // ── Status dot color ──
  const statusColor = (status) => {
    if (status === 'success') return 'bg-emerald-500';
    if (status === 'info') return 'bg-blue-500';
    if (status === 'warning') return 'bg-amber-500';
    return 'bg-slate-400';
  };

  // ── Time range labels (multilanguage) ──
  const rangeLabels = {
    daily: t('admin.daily', 'Daily'),
    weekly: t('admin.weekly', 'Weekly'),
    monthly: t('admin.monthly', 'Monthly'),
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 pb-12" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('admin.dashboard')}</h1>
          <p className="text-slate-500 mt-1">{t('admin.welcome_admin', "Bienvenue dans votre espace d'administration.")}</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {(['daily', 'weekly', 'monthly']).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                timeRange === range
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {rangeLabels[range]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Global error banner ── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))
          : statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={12} />
                    <span>{stat.growth}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                </div>
              </motion.div>
            ))}
      </div>

      {/* ── Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{t('admin.revenue_overview', 'Aperçu des Revenus')}</h3>
              <p className="text-sm text-slate-500">{t('admin.sales_evolution', 'Evolution des ventes')}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium text-slate-500">
              <Calendar size={16} />
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : salesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                {t('admin.no_results')}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value) => [formatDH(value), t('admin.total_sales', 'Ventes')]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-8">{t('admin.sales_by_category', 'Ventes par Catégorie')}</h3>
          <div className="h-[250px] w-full">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                {t('admin.no_results')}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#1e293b', fontWeight: 600, fontSize: 12 }}
                    width={90}
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => [`${value}%`]} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-8 space-y-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5" />)
              : categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-medium text-slate-600 truncate max-w-[120px]">{cat.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{cat.value}%</span>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Best Sellers */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900">{t('admin.best_sellers', 'Produits les plus vendus')}</h3>
            <button className="text-emerald-600 text-sm font-bold hover:underline">{t('admin.view_all', 'Voir tout')}</button>
          </div>
          <div className="space-y-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))
              : bestSellers.length === 0
              ? (
                <div className="text-center text-slate-400 text-sm py-8">{t('admin.no_results')}</div>
              )
              : bestSellers.map((product) => (
                  <div key={product.id ?? product.name} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-4">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover"
                          onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/100/100`; }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <Package size={20} className="text-emerald-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-emerald-600 transition">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.sales} {t('product.units', 'ventes')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{formatDH(product.revenue)}</p>
                      <p className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                        <TrendingUp size={10} /> {product.growth ?? '+0%'}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900">{t('admin.recent_activity', 'Activité Récente')}</h3>
            <button className="text-emerald-600 text-sm font-bold hover:underline">{t('admin.view_all', 'Voir tout')}</button>
          </div>
          <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative pl-10 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                ))
              : recentActivity.length === 0
              ? (
                <div className="text-center text-slate-400 text-sm py-8 pl-10">{t('admin.no_results')}</div>
              )
              : recentActivity.map((item, i) => (
                  <div key={i} className="relative pl-10">
                    <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${statusColor(item.status)}`} />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.action}</p>
                        <p className="text-xs text-slate-500">{item.user}</p>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

// import { useTranslation } from 'react-i18next';
// import { Package, ShoppingBag, Users, ArrowUpRight, DollarSign, Calendar } from 'lucide-react';
// import { motion } from 'motion/react';
// import { 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer, 
//   AreaChart, 
//   Area,
//   BarChart,
//   Bar,
//   Cell
// } from 'recharts';
// import { useState } from 'react';

// const AdminDashboardPage = () => {
//   const { t } = useTranslation();
//   const [timeRange, setTimeRange] = useState('monthly');

//   const salesData = [
//     { name: 'Jan', sales: 4000, orders: 240 },
//     { name: 'Feb', sales: 3000, orders: 198 },
//     { name: 'Mar', sales: 2000, orders: 150 },
//     { name: 'Apr', sales: 2780, orders: 190 },
//     { name: 'May', sales: 1890, orders: 120 },
//     { name: 'Jun', sales: 2390, orders: 170 },
//     { name: 'Jul', sales: 3490, orders: 250 },
//   ];

//   const categoryData = [
//     { name: 'Tapis', value: 45, color: '#10b981' },
//     { name: 'Poterie', value: 25, color: '#3b82f6' },
//     { name: 'Cuir', value: 20, color: '#f59e0b' },
//     { name: 'Bijoux', value: 10, color: '#8b5cf6' },
//   ];

//   const stats = [
//     { label: 'Ventes Totales', value: '125,400 DH', icon: DollarSign, color: 'emerald', growth: '+12.5%' },
//     { label: 'Commandes', value: '1,240', icon: ShoppingBag, color: 'blue', growth: '+8.2%' },
//     { label: 'Produits', value: '64', icon: Package, color: 'amber', growth: '+2' },
//     { label: 'Utilisateurs', value: '8,500', icon: Users, color: 'purple', growth: '+15.3%' },
//   ];

//   const bestSellers = [
//     { name: 'Tapis Beni Ourain', sales: 120, revenue: '300,000 DH', image: 'https://picsum.photos/seed/rug/100/100' },
//     { name: 'Tajine Céramique', sales: 85, revenue: '29,750 DH', image: 'https://picsum.photos/seed/pot/100/100' },
//     { name: 'Pouf Cuir', sales: 64, revenue: '28,800 DH', image: 'https://picsum.photos/seed/leather/100/100' },
//   ];

//   return (
//     <div className="space-y-8 pb-12">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">{t('admin.dashboard')}</h1>
//           <p className="text-slate-500 mt-1">Bienvenue dans votre espace d&apos;administration.</p>
//         </div>
//         <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
//           {['daily', 'weekly', 'monthly'].map((range) => (
//             <button
//               key={range}
//               onClick={() => setTimeRange(range)}
//               className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
//                 timeRange === range 
//                   ? 'bg-emerald-600 text-white shadow-md' 
//                   : 'text-slate-500 hover:bg-slate-50'
//               }`}
//             >
//               {range.charAt(0).toUpperCase() + range.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <motion.div
//             key={stat.label}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group"
//           >
//             <div className="flex justify-between items-start">
//               <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
//                 <stat.icon size={24} />
//               </div>
//               <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
//                 <ArrowUpRight size={12} />
//                 <span>{stat.growth}</span>
//               </div>
//             </div>
//             <div className="mt-4">
//               <p className="text-sm font-medium text-slate-500">{stat.label}</p>
//               <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Revenue Chart */}
//         <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h3 className="text-xl font-bold text-slate-900">Aperçu des Revenus</h3>
//               <p className="text-sm text-slate-500">Evolution des ventes sur les 7 derniers mois</p>
//             </div>
//             <div className="flex items-center space-x-2 text-sm font-medium text-slate-500">
//               <Calendar size={16} />
//               <span>Jan 2024 - Juil 2024</span>
//             </div>
//           </div>
//           <div className="h-[350px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={salesData}>
//                 <defs>
//                   <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
//                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                 <XAxis 
//                   dataKey="name" 
//                   axisLine={false} 
//                   tickLine={false} 
//                   tick={{ fill: '#64748b', fontSize: 12 }}
//                   dy={10}
//                 />
//                 <YAxis 
//                   axisLine={false} 
//                   tickLine={false} 
//                   tick={{ fill: '#64748b', fontSize: 12 }}
//                   tickFormatter={(value) => `${value / 1000}k`}
//                 />
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: '#fff', 
//                     borderRadius: '12px', 
//                     border: 'none', 
//                     boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
//                   }}
//                 />
//                 <Area 
//                   type="monotone" 
//                   dataKey="sales" 
//                   stroke="#10b981" 
//                   strokeWidth={3}
//                   fillOpacity={1} 
//                   fill="url(#colorSales)" 
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Category Distribution */}
//         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
//           <h3 className="text-xl font-bold text-slate-900 mb-8">Ventes par Catégorie</h3>
//           <div className="h-[250px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={categoryData} layout="vertical">
//                 <XAxis type="number" hide />
//                 <YAxis 
//                   dataKey="name" 
//                   type="category" 
//                   axisLine={false} 
//                   tickLine={false}
//                   tick={{ fill: '#1e293b', fontWeight: 600, fontSize: 14 }}
//                   width={80}
//                 />
//                 <Tooltip cursor={{ fill: 'transparent' }} />
//                 <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
//                   {categoryData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="mt-8 space-y-4">
//             {categoryData.map((cat) => (
//               <div key={cat.name} className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
//                   <span className="text-sm font-medium text-slate-600">{cat.name}</span>
//                 </div>
//                 <span className="text-sm font-bold text-slate-900">{cat.value}%</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Best Sellers */}
//         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
//           <div className="flex justify-between items-center mb-8">
//             <h3 className="text-xl font-bold text-slate-900">Produits les plus vendus</h3>
//             <button className="text-emerald-600 text-sm font-bold hover:underline">Voir tout</button>
//           </div>
//           <div className="space-y-6">
//             {bestSellers.map((product) => (
//               <div key={product.name} className="flex items-center justify-between group">
//                 <div className="flex items-center space-x-4">
//                   <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
//                   <div>
//                     <p className="font-bold text-slate-900 group-hover:text-emerald-600 transition">{product.name}</p>
//                     <p className="text-xs text-slate-500">{product.sales} ventes</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-slate-900">{product.revenue}</p>
//                   <p className="text-xs text-emerald-600 font-bold">+5.4%</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Recent Orders Activity */}
//         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
//           <div className="flex justify-between items-center mb-8">
//             <h3 className="text-xl font-bold text-slate-900">Activité Récente</h3>
//             <button className="text-emerald-600 text-sm font-bold hover:underline">Voir tout</button>
//           </div>
//           <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
//             {[
//               { time: 'Il y a 2 min', action: 'Nouvelle commande', user: 'Ahmed M.', status: 'success' },
//               { time: 'Il y a 15 min', action: 'Nouvel utilisateur', user: 'Fatima Z.', status: 'info' },
//               { time: 'Il y a 1h', action: 'Paiement reçu', user: 'Youssef A.', status: 'success' },
//               { time: 'Il y a 3h', action: 'Produit épuisé', user: 'Tapis Beni Ourain', status: 'warning' },
//             ].map((item, i) => (
//               <div key={i} className="relative pl-10">
//                 <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
//                   item.status === 'success' ? 'bg-emerald-500' : 
//                   item.status === 'info' ? 'bg-blue-500' : 'bg-amber-500'
//                 }`}></div>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm font-bold text-slate-900">{item.action}</p>
//                     <p className="text-xs text-slate-500">{item.user}</p>
//                   </div>
//                   <span className="text-xs text-slate-400">{item.time}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardPage;
