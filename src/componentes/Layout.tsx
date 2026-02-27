import React from 'react';
import Sidebar from "./Sidebar"; 
import BottomNav from "./BottomNav";

interface LayoutProps {
    children: React.ReactNode;
    hideNav?: boolean; 
}

export default function Layout({ children, hideNav }: LayoutProps) {

    if (hideNav) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center">
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-8 max-w-7xl mx-auto md:pl-64 pb-16 md:pb-8">
                    {children}
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                <BottomNav />
            </div>
            
        </div>
    );
}