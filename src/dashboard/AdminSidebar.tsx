import { BarChart, Clipboard, ShoppingCart, StoreIcon, User, Users, Menu, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router'

const AdminSidebar: React.FC = () => {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)

    const isActive = (path: string) => location.pathname === path

    const navigationItems = [
        { name: 'Analytics', path: '/admin/dashboard', icon: <BarChart size={20} /> },
        { name: 'All Orders', path: '/admin/dashboard/all-orders', icon: <ShoppingCart size={20} /> },
        { name: 'Menu Items', path: '/admin/dashboard/all-menu-items', icon: <Clipboard size={20} /> },
        { name: 'All Customers', path: '/admin/dashboard/all-customers', icon: <Users size={20} /> },
        { name: 'All Restaurants', path: '/admin/dashboard/all-restaurants', icon: <StoreIcon size={20} /> },
        { name: 'Admin Profile', path: '/admin/dashboard/admin-profile', icon: <User size={20} /> }
    ]

    return (
        <>
            {/* --- Mobile Trigger (Top Bar) --- */}
            <div className="lg:hidden fixed top-0 left-0 w-full bg-black border-b border-gray-800 p-4 flex items-center justify-between z-50">
                <h1 className="text-lg font-bold text-green-500">Admin Panel</h1>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-white bg-zinc-900 rounded-md"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* --- Overlay (Mobile Only) --- */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* --- Sidebar --- */}
            <div className={`
                bg-black border-r border-zinc-800 shadow-sm transition-all duration-300 
                w-64 min-h-screen fixed left-0 top-0 lg:top-23 z-40
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-zinc-800 hidden lg:block">
                    <div className="flex items-center">
                        <h1 className="text-lg font-bold text-green-500">Admin Panel</h1>
                    </div>
                </div>

                {/* Mobile Header Spacer (Avoids content overlap with mobile trigger) */}
                <div className="h-20 lg:hidden" />

                {/* Navigation Menu */}
                <nav className="p-4 space-y-2">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)} // Close sidebar on link click (mobile)
                            className={`flex items-center px-4 py-3 lg:py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive(item.path)
                                    ? 'bg-green-700 text-white shadow-md'
                                    : 'text-gray-400 hover:bg-zinc-900 hover:text-green-500'
                            }`}
                        >
                            <span className="shrink-0 mr-3">
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            
            {/* --- Layout Spacer (Prevents content from being hidden behind fixed sidebar) --- */}
            <div className="hidden lg:block w-64 shrink-0" />
        </>
    )
}

export default AdminSidebar