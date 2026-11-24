import {
    Home,
    User,
    Settings,
    Bell,
    Plus,
    Pencil,
    Trash2,
    Search,
    Menu,
    X,
    Newspaper,
    CircleHelp,
    Phone,
    Hospital,
    Cross,
    Users,
    Image,
    Clock,
} from 'lucide-react';

const icons = {
    home: Home,
    user: User,
    settings: Settings,
    bell: Bell,
    plus: Plus,
    edit: Pencil,
    delete: Trash2,
    search: Search,
    menu: Menu,
    close: X,
    newspaper: Newspaper,
    'circle-help': CircleHelp,
    phone: Phone,
    hospital: Hospital,
    cross: Cross,
    users: Users,
    image: Image,
    clock: Clock,
};
export default function Icon({
    name,
    size = 20,
    color = 'currentColor',
    strokeWidth = 2,
    className = '',
}) {
    const IconComponent = icons[name];

    if (!IconComponent) return null;

    return (
        <IconComponent
            size={size}
            color={color}
            strokeWidth={strokeWidth}
            className={className}
        />
    );
}
