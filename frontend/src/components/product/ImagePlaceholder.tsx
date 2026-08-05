import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label: string;
  alt: string;
  className?: string;
  showBrand?: boolean;
}

export function ImagePlaceholder({
  label,
  alt,
  className,
  showBrand = true,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-gradient-to-br from-brand-mint to-brand-sand rounded-2xl overflow-hidden",
        className
      )}
      aria-label={alt}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[radial-gradient(circle_at_30%_40%,#0F5F5C_0%,transparent_60%)]" />
      </div>
      {showBrand && (
        <div className="w-16 h-16 rounded-full bg-brand-teal/20 flex items-center justify-center mb-3">
          <span className="text-brand-teal font-bold text-2xl font-sans">N</span>
        </div>
      )}
      <p className="text-sm font-medium text-brand-teal text-center px-4">{label}</p>
      <p className="text-xs text-brand-gray mt-1 opacity-70">صورة المنتج</p>
    </div>
  );
}
