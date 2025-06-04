import { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAutoResizeTextarea } from "@/shared/hooks/useAutosizeTextarea";
import type {
  IInputProps,
  IPasswordToggleProps,
  ITextAreaInputProps,
  ITextInputProps,
  IErrorMessageProps,
} from "@/features/ui/input/types";
import { colorClasses } from "@/shared/model/color";

const MAX_LENGTH = 200;

function PasswordToggle(props: Readonly<IPasswordToggleProps>) {
  const { showPassword, toggle } = props;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
      className="absolute right-4 top-1/2 -translate-y-1/2
        text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white
        transition-colors"
    >
      {showPassword ? (
        <EyeOff className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
    </button>
  );
}

function TextAreaInput(props: Readonly<ITextAreaInputProps>) {
  const {
    id,
    name,
    value,
    placeholder,
    onChange,
    onFocus,
    onBlur,
    maxLength,
    className,
    textareaRef,
    error,
  } = props;

  const remaining = maxLength - value.length;
  const isNearLimit = remaining <= 20;

  return (
    <>
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        maxLength={maxLength}
        className={`${className} resize-none overflow-hidden transition-[height] duration-200`}
        aria-invalid={!!error}
        aria-describedby={error ? `error-${name}` : undefined}
      />
      <p
        className={`text-xs text-right mt-1 ${
          isNearLimit
            ? "text-orange-500 dark:text-orange-400"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {value.length} / {maxLength}
      </p>
    </>
  );
}

function TextInput(props: Readonly<ITextInputProps>) {
  const {
    id,
    name,
    type,
    value,
    placeholder,
    onChange,
    onFocus,
    onBlur,
    className,
    autoFocus,
    error,
  } = props;

  return (
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className={className}
      autoFocus={autoFocus}
      aria-invalid={!!error}
      aria-describedby={error ? `error-${name}` : undefined}
    />
  );
}

function ErrorMessage(props: Readonly<IErrorMessageProps>) {
  const { error, name } = props;
  return (
    <div
      id={`error-${name}`}
      className={`
        flex items-center text-red-500 text-sm
        overflow-hidden transition-all duration-300
        ${error ? "opacity-100 max-h-10 mt-1" : "opacity-0 max-h-0 mt-0"}
      `}
      aria-live="polite"
    >
      <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
      <span>{error ?? "\u00A0"}</span>
    </div>
  );
}

export const Input: React.FC<IInputProps> = ({
  as = "input",
  type = "text",
  placeholder = "",
  value,
  icon,
  name,
  label,
  onChange,
  onFocus,
  onBlur,
  error,
  showToggle = false,
  className = "",
  color = "blue",
  autoFocus = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const textareaRef = useAutoResizeTextarea(value, as);

  const inputId = `input-${name}`;
  const colorConfig = colorClasses[color];

  const inputStyles = `w-full px-4 py-4 ${
    showToggle ? "pr-12" : ""
  } rounded-2xl border-2 transition-all duration-300
    bg-gray-50 dark:bg-gray-700/50 backdrop-blur-sm
    ${
      error
        ? "border-red-300 focus:border-red-500 focus:ring-red-200 hover:border-red-400"
        : `border-gray-200 dark:border-gray-600 ${colorConfig.focus} ${colorConfig.hover}`
    }
    focus:outline-none focus:ring-4 focus:ring-opacity-20
    dark:text-white placeholder-gray-400
    hover:shadow-md focus:shadow-lg`;

  let inputType = type;
  if (type === "password" && showToggle) {
    inputType = showPassword ? "text" : "password";
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={inputId}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {icon && <span className={`w-4 h-4 ${colorConfig.icon}`}>{icon}</span>}
        {label}
      </label>
      <div className="relative">
        {as === "textarea" ? (
          <TextAreaInput
            id={inputId}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            maxLength={MAX_LENGTH}
            className={inputStyles}
            textareaRef={textareaRef}
            error={error}
          />
        ) : (
          <TextInput
            id={inputId}
            name={name}
            type={inputType}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className={inputStyles}
            autoFocus={autoFocus}
            error={error}
          />
        )}
        {type === "password" && showToggle && (
          <PasswordToggle
            showPassword={showPassword}
            toggle={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <ErrorMessage error={error} name={name} />
    </div>
  );
};
