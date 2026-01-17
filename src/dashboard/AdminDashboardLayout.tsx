import React from 'react'
// import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AdminSidebar from './AdminSidebar'

interface DashboardLayoutProps {
    children: React.ReactNode
}

const AdminDashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* <Navbar /> */}

            {/* Layout Container */}
            <div className="flex flex-1"> 
                {/* Sidebar handles its own fixed positioning and spacing */}
                <AdminSidebar />

                {/* Main Content */}
                <main className="flex-1 w-full">
                    {/* Removed lg:ml-64 here because the Sidebar 
                       already provides a spacer div 
                    */}
                    <div className="p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer - Adjusted to sit correctly next to sidebar */}
            <div className="lg:pl-64">
                <Footer />
            </div>
        </div>
    )
}

export default AdminDashboardLayout