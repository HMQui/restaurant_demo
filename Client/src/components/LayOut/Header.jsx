import { useSelector } from 'react-redux';

import UserHeader from './UserHeader';
import AdminHeader from './AdminHeader';

function Header() {
    const { role } = useSelector((state) => state.infoUser);

    return <>{role !== 'admin' ? <UserHeader /> : <AdminHeader />}</>;
}

export default Header;
