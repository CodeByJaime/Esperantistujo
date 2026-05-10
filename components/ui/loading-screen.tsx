import { LoadingSpinner } from "./loading-spinner";

interface LoadingScreenProps {
  showIcon?: boolean;
}

export function LoadingScreen({ 
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
      </div>
    </div>
  );
}
