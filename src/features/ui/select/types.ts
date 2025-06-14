interface ISelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

export interface ISelectProps {
  readonly name: string;
  readonly label?: string;
  readonly value?: string;
  readonly options: readonly ISelectOption[];
  readonly placeholder?: string;
  readonly onChange?: (value: string) => void;
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly error?: string;
  readonly icon?: React.ReactElement;
  readonly className?: string;
  readonly color?: "blue" | "green" | "yellow" | "purple" | "orange";
  readonly disabled?: boolean;
}

export interface IOptionProps {
  readonly option: ISelectOption;
  readonly isSelected: boolean;
  readonly onClick: (option: ISelectOption) => void;
}

export interface IErrorMessageProps {
  readonly error?: string;
  readonly name: string;
}
