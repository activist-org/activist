export interface BtnBase {
  id?: string;
  cta: boolean;
  label?: string;
  hideLabelOnMobile?: boolean;
  fontSize: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  iconSize?: string;
  isDisabled?: boolean;
  ariaLabel: string;
}

withDefaults(defineProps<BtnBase>(), {
  fontSize: "base",
  iconSize: "1em",
});

export interface BtnAction extends BtnBase {
  leftIcon?: string;
  rightIcon?: string;
  counter?: number;
}

export interface BtnActionDropdown extends BtnAction {
  dropdownIcon: string;
  dropdownOptions: string[];
  dropdownOptionsCallback: (option: string) => void;
  ariaLabelDropdown: string;
}

export interface BtnRoute extends BtnBase {
  linkTo: string;
  leftIcon?: string;
  rightIcon?: string;
}
