import { LogOut, MapPin, Menu, Moon, Settings, Sun, UsersRound } from "lucide-react";
import Dropdown from "./ui/DropDown";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import Tooltip from "./ui/ToolTip";
import { useRouter } from "next/router";



export default function Index({
  header,
  headerTitle,
  children
}: {
  header: React.ReactNode;
  headerTitle: string;
  children: React.ReactNode;
}) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const router = useRouter();


  const dropdownItems = [
    {
      "id": "settings",
      "name": "Settings",
      "icon": <Settings className="w-5 h-5" />
    },
    {
      "id": "toggleTheme",
      "name": theme === 'light' ? "Dark Mode" : "Light Mode",
      "icon": theme === 'light' ? <Moon className="w-5 h-5 text-blue-600" /> : <Sun className="w-5 h-5 text-yellow-300" />
    },
    {
      "id": "manageUsers",
      "name": "Manage Users",
      "icon": <UsersRound className="w-5 h-5" />
    },
    {
      "id": "manageLocations",
      "name": "Manage Locations",
      "icon": <MapPin className="w-5 h-5" />
    },
    {
      "id": "logout",
      "name": "Logout",
      "icon": <LogOut className="w-5 h-5 text-red-500" />
    }
  ];

  const handleSelect = (id: string) => {
    if (id === 'toggleTheme') {
      return toggleTheme();
    }
    if (id === 'settings') {
      return router.push('/settings');
    }
    if (id === 'manageUsers') {
      return router.push('/admin/users');
    }
    if (id === 'manageLocations') {
      return router.push('/admin/locations');
    }
    if (id === 'logout') {
      return router.push('/login');
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col p-2 space-y-2">
      <div className="w-full border-b-2 border-b-border py-2 flex justify-between items-center px-2">
        <h1 className="font-bold text-2xl">{headerTitle}</h1>
        <div className="flex items-center space-x-2 pr-4">
          {header}
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
      {children}
    </div>
  )
}