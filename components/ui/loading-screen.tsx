import { LoadingSpinner } from "./loading-spinner";

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  showIcon?: boolean;
}

export function LoadingScreen({ 
  title = "Ŝargante profilon...", 
  subtitle = "Bonvolu atendi dum ni ŝargas viajn informojn.",
  showIcon = true 
}: LoadingScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {showIcon && (
          <div className="w-16 h-16 rounded-full bg-esperanto-verda/15 border border-esperanto-verda/30 flex items-center justify-center mx-auto mb-4">
            <LoadingSpinner size="lg" />
          </div>
        )}
        <h2 className="font-display text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="font-sans-dm text-white/50 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
