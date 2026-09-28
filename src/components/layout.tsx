import { Outlet } from 'react-router';
import Drawer from './drawer';
import Header from './header';

export default function Layout() {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Drawer />
            <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                <Header />
                <Outlet />
            </main>
        </div>
    );
}
