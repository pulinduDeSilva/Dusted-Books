import { useState } from "react";
import NavAdmin from "../components/Nav_Admin";
import activeTabs from "../enums/activeTabs";
import UserManagement from "../components/admin/UserManagement";

function AdminPage() {

    const [activeLink, setActiveLink] = useState<string>(activeTabs.USER_MANAGEMENT);

    const renderContent = () => {
        switch (activeLink) {
            case activeTabs.USER_MANAGEMENT:
                return (
                    <>
                        <UserManagement/>
                    </>
                );
            case activeTabs.BOOK_MANAGEMENT:
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Book Management</h1>
                    </>
                );
        }
    };

    return (
        <>
        <div className="flex min-h-screen w-full">
            <NavAdmin currentTab={activeLink} onLinkClick={setActiveLink} />
            <div className="flex-1 p-10">
                {
                    renderContent()
                }
            </div>
        </div>
        </>
    );
}

export default AdminPage;