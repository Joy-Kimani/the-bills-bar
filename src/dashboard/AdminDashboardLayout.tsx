import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AdminSidebar from './AdminSidebar'

interface DashboardLayoutProps {
    children: React.ReactNode
}

const AdminDashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* Top Navbar */}
            <Navbar />

            {/* Layout Container */}
            <div className="flex flex-1 pt-[64px] lg:pt-0"> 
                {/* Note: pt-[64px] accounts for the mobile top bar 
                   if your Navbar doesn't already handle it. 
                */}

                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <main className="flex-1 transition-all duration-300 w-full lg:ml-64">
                    {/* 1. Removed hardcoded ml-64 and made it lg:ml-64 
                        2. Added w-full to ensure it takes up phone width
                    */}
                    <div className="p-4 md:p-6 lg:p-8 min-h-[calc(100vh-128px)]">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <div className="transition-all duration-300 lg:ml-64">
                <Footer />
            </div>
        </div>
    )
}

export default AdminDashboardLayout