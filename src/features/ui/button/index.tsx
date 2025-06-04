import { Loader2 } from "lucide-react";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  icon: React.ElementType;
  children: React.ReactNode;
}

export const Button: React.FC<IButtonProps> = ({
  isLoading,
  icon: IconComponent,
  children,
  ...props
}) => (
  <button
    {...props}
    disabled={isLoading || props.disabled}
    aria-disabled={isLoading || props.disabled}
    tabIndex={isLoading ? -1 : 0}
    className={`
      relative overflow-hidden w-full py-4 px-6 rounded-2xl font-semibold text-lg text-white shadow-lg 
      flex items-center justify-center gap-2 transition-all duration-300 group
      focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-500
      ${
        isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-blue-500/25"
      }
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600 before:via-blue-700 before:to-purple-700 
      before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
    `}
  >
    <span className="relative flex items-center gap-2 z-10">
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <IconComponent className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
      )}
      {children}
    </span>
    {!isLoading && (
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
    )}
  </button>
);
