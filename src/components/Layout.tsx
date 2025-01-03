import { Cctv, FileText, Headset, LayoutDashboard, LogOut, MapPin, Menu, Settings, Users } from "lucide-react";
import Dropdown from "./ui/DropDown";
import { ReactNode } from "react";
// import { ThemeContext } from "@/context/ThemeContext";
import Tooltip from "./ui/ToolTip";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";



export default function Index({
  header,
  headerTitle,
  children
}: {
  header?: ReactNode;
  headerTitle: ReactNode;
  children: ReactNode;
}) {
  // const { theme, toggleTheme } = useContext(ThemeContext);
  const router = useRouter();


  const dropdownItems = [
    ...(router.pathname !== "/settings" ? [{
      "id": "settings",
      "name": "Settings",
      "icon": <Settings className="w-5 h-5" />
    }] : []),
    ...(!router.pathname.includes("/admin") ? [{
      "id": "dashboard",
      "name": "Dashboard",
      "icon": <LayoutDashboard className="w-5 h-5" />
    }] : []),
    ...(router.pathname !== "/checkInHub" ? [{
      "id": "checkInHub",
      "name": "Check-In Hub",
      "icon": <Headset className="w-5 h-5" />
    }] : []),
    ...(router.pathname !== "/watchCenter" ? [{
      "id": "watchCenter",
      "name": "Watch Center",
      "icon": <Cctv className="w-5 h-5" />
    }] : []),
    // {
    //   "id": "toggleTheme",
    //   "name": theme === 'light' ? "Dark Mode" : "Light Mode",
    //   "icon": theme === 'light' ? <Moon className="w-5 h-5 text-blue-600" /> : <Sun className="w-5 h-5 text-yellow-300" />
    // },
    {
      "id": "logout",
      "name": "Logout",
      "icon": <LogOut className="w-5 h-5 text-red-500" />
    }
  ];

  const handleSelect = (id: string) => {
    // if (id === 'toggleTheme') {
    //   return toggleTheme();
    // }
    if (id === 'settings') {
      return router.push('/settings');
    }
    if (id === 'dashboard') {
      return router.push('/admin/dashboard');
    }
    if (id === 'watchCenter') {
      return router.push('/watchCenter');
    }
    if (id === 'checkInHub') {
      return router.push('/checkInHub');
    }
    if (id === 'logout') {
      destroyCookie(null, 'userToken');
      return router.push('/');
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col space-y-2">
      <div className="w-full border-b-2 border-b-border py-2 flex justify-between items-center px-2 bg-foreground p-2">
        {headerTitle}
        <div className="flex items-center space-x-2 pr-4">
          {header}
          {router.pathname.includes("/admin") && (
            <div className="flex items-center gap-2">
              <div className={
                `${router.pathname === '/admin/documents' ? 'bg-highlight' : 'hover:bg-highlight'} rounded-md p-1 cursor-pointer`
              }
                onClick={() => router.push('/admin/documents')}
              >
                <Tooltip tooltip="Documents" position="bottom">
                  <FileText className="w-5 h-5" />
                </Tooltip>
              </div>
              <div className={
                `${router.pathname === '/admin/locations' ? 'bg-highlight' : 'hover:bg-highlight'} rounded-md p-1 cursor-pointer`
              }
                onClick={() => router.push('/admin/locations')}
              >
                <Tooltip tooltip="Locations" position="bottom">
                  <MapPin className="w-5 h-5" />
                </Tooltip>
              </div>
              <div className={
                `${router.pathname === '/admin/users' ? 'bg-highlight' : 'hover:bg-highlight'} rounded-md p-1 cursor-pointer`
              }
                onClick={() => router.push('/admin/users')}
              >
                <Tooltip tooltip="Users" position="bottom">
                  <Users className="w-5 h-5" />
                </Tooltip>
              </div>
              <div className={
                `${router.pathname === '/admin/dashboard' ? 'bg-highlight' : 'hover:bg-highlight'} rounded-md p-1 cursor-pointer`
              }
                onClick={() => router.push('/admin/dashboard')}
              >
                <Tooltip tooltip="Dashboard" position="bottom">
                  <LayoutDashboard className="w-5 h-5" />
                </Tooltip>
              </div>
            </div>
          )}
          <div className="border-l-2 border-l-border pl-2">
            <div>
              <Dropdown
                id='person'
                title={
                  <div className='flex items-center gap-2'>
                    <Tooltip tooltip="Menu" position="bottom">
                      <Menu />
                    </Tooltip>
                  </div>
                }
                position="bottom-right"
                data={dropdownItems}
                hasImage
                style='bg-purple-800'
                selectedId='3'
                onSelect={handleSelect}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        {children}
      </div>
    </div>
  )
}