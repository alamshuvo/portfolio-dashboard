import { AdminHeader } from "@/component/module/admin/AdminHeader";
interface HeaderProps {
    role: "ADMIN"
}

const Header = ({ role }: HeaderProps) => {
    if (role === 'ADMIN') {
        return <AdminHeader />
    } 
};

export default Header;