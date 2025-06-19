import { useState, useRef, useEffect } from "react";
import { AlertCircle, ChevronDown, Check } from "lucide-react";
import type {
  ISelectProps,
  IOptionProps,
  IErrorMessageProps,
} from "@/features/ui/select/types";
import { colorClasses } from "@/shared/model/color";

function ErrorMessage({ error, name }: Readonly<IErrorMessageProps>) {
  return (
    <div
      id={`error-${name}`}
      className={`
        flex items-center text-red-500 text-sm
        overflow-hidden transition-all duration-300 ease-out
        ${error ? "opacity-100 max-h-10 mt-1" : "opacity-0 max-h-0"}
      `}
      aria-live="polite"
    >
      <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
}

function Option({ option, isSelected, onClick }: Readonly<IOptionProps>) {
  const handleClick = () => onClick(option);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(option);
    }
  };

  return (
    <div
      className="px-4 py-3 cursor-pointer flex items-center justify-between 
        hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150
        focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="option"
      aria-selected={isSelected}
    >
      <span className="text-gray-900 dark:text-white">{option.label}</span>
      {isSelected && <Check className="w-4 h-4 text-blue-500" />}
    </div>
  );
}

export const Select: React.FC<ISelectProps> = ({
  name,
  label,
  value,
  options = [],
  placeholder = "Оберіть опцію...",
  onChange,
  onFocus,
  onBlur,
  error,
  icon,
  className = "",
  color = "blue",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const listboxId = `listbox-${name}`;
  const colorConfig = colorClasses[color];
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label ?? "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onBlur]);

  const handleToggle = () => {
    if (disabled) return;

    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      onFocus?.();
    } else {
      onBlur?.();
    }
  };

  const handleOptionClick = (option: { value: string; label: string }) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleToggle();
        break;
      case "Escape":
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          onBlur?.();
        }
        break;
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          onFocus?.();
        }
        break;
    }
  };

  const getBorderStyles = () => {
    if (disabled)
      return "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800";
    if (error)
      return "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-200 hover:border-red-400";
    return `border-gray-200 dark:border-gray-600 focus:border-${color}-500 focus:ring-4 focus:ring-${color}-200 ${colorConfig.hover}`;
  };

  return (
    <div className={`space-y-2 ${className}`} ref={selectRef}>
      {label && (
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {icon && (
            <span className={`w-4 h-4 ${colorConfig.icon}`}>{icon}</span>
          )}
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`
            w-full px-4 py-4 pr-12 rounded-2xl border-2 cursor-pointer
            bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm
            transition-all duration-300 ease-out focus:outline-none
            hover:shadow-md focus:shadow-lg dark:text-white
            ${getBorderStyles()}
          `}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-invalid={!!error}
          aria-describedby={error ? `error-${name}` : undefined}
        >
          <span
            className={`block truncate ${
              displayValue ? "text-gray-900 dark:text-white" : "text-gray-400"
            }`}
          >
            {displayValue || placeholder}
          </span>
          <ChevronDown
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 
              text-gray-500 dark:text-gray-300 pointer-events-none
              transition-transform duration-300 ease-out ${
                isOpen ? "rotate-180" : ""
              }`}
          />
        </div>
        <div
          id={listboxId}
          ref={listboxRef}
          className={`
            absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg 
            max-h-60 overflow-hidden origin-top
            transition-all duration-200 ease-out
            ${
              isOpen
                ? "opacity-100 scale-y-100 visible"
                : "opacity-0 scale-y-95 invisible"
            }
          `}
          role="listbox"
        >
          <div className="overflow-y-auto max-h-60">
            {options.length > 0 ? (
              options.map((option) => (
                <Option
                  key={option.value}
                  option={option}
                  isSelected={value === option.value}
                  onClick={handleOptionClick}
                />
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                Немає опцій
              </div>
            )}
          </div>
        </div>
      </div>
      <ErrorMessage error={error} name={name} />
    </div>
  );
};
