import { Link } from "react-router-dom";
import { UserPlus, LogIn } from "lucide-react";

interface ILinkTextProps {
  spanText: string;
  to: string;
  linkText: string;
}

interface IAuthHeaderProps {
  title: string;
  description: string;
  icon?: "register" | "login";
}

export const LinkText: React.FC<ILinkTextProps> = ({
  spanText,
  to,
  linkText,
}) => (
  <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
    <span>{spanText} </span>
    <Link
      to={to}
      aria-label={`${spanText} ${linkText}`}
      className="text-blue-600 font-semibold hover:underline focus-visible:underline 
      focus-visible:outline-none dark:text-blue-500 transition-colors duration-200"
    >
      {linkText}
    </Link>
  </p>
);

export const AuthHeader: React.FC<IAuthHeaderProps> = ({
  title,
  description,
  icon = "register",
}) => {
  const IconComponent = icon === "register" ? UserPlus : LogIn;

  return (
    <div className="text-center mb-8">
      <div
        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500
      to-purple-600 rounded-2xl mb-4 shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-3 animate-pulse"
        role="img"
        aria-label={`Іконка ${icon === "register" ? "реєстрації" : "входу"}`}
      >
        <IconComponent className="w-8 h-8 text-white transition-transform duration-300" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};
