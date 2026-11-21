function Icon({ icon, className = '', ...props }) {
  return <i className={`fa-solid ${icon} ${className}`} aria-hidden="true" {...props} />;
}

export const LayoutDashboard = (props) => <Icon icon="fa-table-columns" {...props} />;
export const Asterisk = (props) => <Icon icon="fa-asterisk" {...props} />;
export const Newspaper = (props) => <Icon icon="fa-newspaper" {...props} />;
export const HelpCircle = (props) => <Icon icon="fa-circle-question" {...props} />;
export const PhoneCall = (props) => <Icon icon="fa-phone" {...props} />;
export const Search = (props) => <Icon icon="fa-magnifying-glass" {...props} />;
export const Plus = (props) => <Icon icon="fa-plus" {...props} />;
export const Upload = (props) => <Icon icon="fa-upload" {...props} />;
export const Calendar = (props) => <Icon icon="fa-calendar" {...props} />;
export const ChevronDown = (props) => <Icon icon="fa-chevron-down" {...props} />;
export const ImageIcon = (props) => <Icon icon="fa-image" {...props} />;
export const Image = ImageIcon;
export const Grid2x2 = (props) => <Icon icon="fa-table-cells" {...props} />;
export const LogOut = (props) => <Icon icon="fa-arrow-right-from-bracket" {...props} />;
export const Edit3 = (props) => <Icon icon="fa-pen-to-square" {...props} />;
export const Trash2 = (props) => <Icon icon="fa-trash-can" {...props} />;
export const ShieldCheck = (props) => <Icon icon="fa-shield-halved" {...props} />;
