import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost";
    icon?: boolean;
}

export default function Button({ children, variant = "primary", icon = false, className, ...props }: ButtonProps) {
    const baseClasses = "relative overflow-hidden group inline-flex items-center justify-center gap-2 px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-500 rounded-none";

    const variants = {
        primary: "bg-white text-black hover:bg-white/90",
        outline: "border border-white/30 text-white hover:border-white hover:bg-white/5",
        ghost: "text-white hover:text-white/70"
    };

    return (
        <button className={`${baseClasses} ${variants[variant]} ${className || ""}`} {...props}>
            <span className="relative z-10 flex items-center gap-2">
                {children}
                {icon && (
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                )}
            </span>
            {/* Glow Effect */}
            {variant === "primary" && (
                <div className="absolute inset-0 bg-white/20 translate-y-full blur-md transition-transform duration-500 group-hover:translate-y-0" />
            )}
        </button>
    );
}
