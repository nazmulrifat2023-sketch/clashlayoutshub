interface AdUnitProps {
  slot?: string;
  className?: string;
  size?: "banner" | "rectangle" | "leaderboard";
}

const sizeClasses = {
  banner: "h-[90px] w-full",
  rectangle: "h-[250px] w-full max-w-[300px]",
  leaderboard: "h-[90px] w-full max-w-[728px]",
};

const sizeLabel = {
  banner: "728×90",
  rectangle: "300×250",
  leaderboard: "728×90",
};

export function AdUnit({ slot = "default", className = "", size = "banner" }: AdUnitProps) {
  return (
    <div
      className={`flex items-center justify-center bg-muted/40 border border-dashed border-border rounded-lg text-muted-foreground/50 text-xs font-medium ${sizeClasses[size]} ${className}`}
      aria-label="Advertisement"
      data-ad-slot={slot}
    >
      <span>Ad {sizeLabel[size]}</span>
    </div>
  );
}
