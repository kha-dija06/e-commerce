import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <div className={`flex items-center justify-center ${fullPage ? 'fixed inset-0 bg-white/80 z-50' : 'py-12'}`}>
      <div className="flex flex-col items-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        {fullPage && <p className="mt-4 text-emerald-700 font-medium animate-pulse">Chargement...</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
