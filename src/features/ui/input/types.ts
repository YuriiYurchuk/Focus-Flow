export interface IBaseInputProps<T = HTMLInputElement | HTMLTextAreaElement> {
  readonly id: string;
  readonly name: string;
  readonly value: string;
  readonly placeholder?: string;
  readonly onChange: (e: React.ChangeEvent<T>) => void;
  readonly onFocus?: (e: React.FocusEvent<T>) => void;
  readonly onBlur?: (e: React.FocusEvent<T>) => void;
  readonly className: string;
  readonly error?: string;
}

export interface ITextAreaInputProps
  extends IBaseInputProps<HTMLTextAreaElement> {
  readonly maxLength: number;
  readonly textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export interface ITextInputProps extends IBaseInputProps<HTMLInputElement> {
  readonly type: string;
  readonly autoFocus?: boolean;
}

export interface IPasswordToggleProps {
  readonly showPassword: boolean;
  readonly toggle: () => void;
}

export interface IErrorMessageProps {
  readonly error?: string;
  readonly name: string;
}

export interface IInputProps {
  readonly as?: "input" | "textarea";
  readonly type?: string;
  readonly placeholder?: string;
  readonly value: string;
  readonly icon?: React.ReactElement;
  readonly name: string;
  readonly label: string;
  readonly onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  readonly onFocus?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  readonly onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  readonly error?: string;
  readonly showToggle?: boolean;
  readonly className?: string;
  readonly color?: "blue" | "purple" | "green" | "yellow" | "orange";
  readonly autoFocus?: boolean;
}
