import React, { useContext, useState } from "react";
import {
  Menu,
  ArrowLeft,
  LayoutDashboard,
  UsersRound,
  CircleUserRound,
  LogOut,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Accordion, AccordionContent, AccordionHeader } from "./ui/Accordian";
import { ThemeContext } from "@/context/ThemeContext";

const sideBarLinks = [
  {
    category: "DASHBOARD",
    links: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
        href: "/admin/dashboard",
      },
    ],
  },
  {
    category: "USERS",
    links: [
      {
        name: "MANAGE USERS",
        icon: <UsersRound className="w-5 h-5" />,
        href: "/admin/users",
      },
    ],
  }
];

const Sidebar = ({
  isOpen,
  onClose,
  businessName
}: {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { theme, toggleTheme } = useContext(ThemeContext);


  const router = useRouter();

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleUserLogout = () => {
    router.push('/login');
    // TODO: Implement user logout
  };

  return (
    <div
      className={`w-3/4 md:w-1/4 lg:w-1/6 h-screen bg-background p-4 flex flex-col justify-between gap-4 fixed top-0 bottom-0 border-r border-border transition-transform duration-300 z-10 lg:z-0 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0`}
    >
      <div className="flex flex-col space-y-3">
        <div className="w-full flex flex-col border-b border-b-border pb-2">
          <div className="w-full flex gap-2 items-center justify-between">
            <h1 className="font-extrabold text-5xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              ORION.
            </h1>
            <button
              className="lg:hidden"
              onClick={onClose}
              aria-label="Close Sidebar"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          </div>
          <div>
            <h1 className="font-bold uppercase text-textAlt">{businessName}</h1>
          </div>
        </div>
        {/* Sidebar Content */}
        <div className="w-full flex flex-col gap-5">
          {sideBarLinks.map((category) => (
            <div key={category.category}>
              <h1 className="text-xs font-extrabold text-textAlt pl-1">
                {category.category}
              </h1>
              {category.links.map((link) => (
                <div key={link.name} className="flex flex-col">
                  <Link
                    href={link.href}
                    className={`text-sm font-semibold uppercase p-1 pl-2 mt-[2px] rounded-md cursor-pointer duration-500 flex items-center gap-1 ${router.pathname === link.href
                      ? "bg-highlight border border-border"
                      : "hover:bg-highlight border border-transparent hover:border hover:border-border"
                      }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Accordion>
        <AccordionHeader onClick={() => toggleAccordion(0)}
          isOpen={openIndex === 0}>
          <div className="w-full flex items-center gap-1">
            <CircleUserRound className="w-6 h-6" />
            <h1 className="font-bold text-xl">John Doe</h1>
          </div>
        </AccordionHeader>
        <AccordionContent isOpen={openIndex === 0}>
          <div className="w-full flex flex-col gap-2">
            <button className="w-full flex gap-1 items-center hover:bg-highlight border border-transparent hover:border hover:border-border duration-500 text-textAlt hover:text-text cursor-pointer px-2 py-1 rounded-md" onClick={handleUserLogout}>
              <Settings className="w-5 h-5" />
              <h1 className="font-semibold">Settings</h1>
            </button>
            <button className="w-full flex gap-1 items-center hover:bg-highlight border border-transparent hover:border hover:border-border duration-500 text-textAlt hover:text-text cursor-pointer px-2 py-1 rounded-md" onClick={handleToggleTheme}>
              {
                theme === 'light' ? (
                  <div className="flex items-center gap-1">
                    <Moon className="w-5 h-5" />
                    <h1 className="font-semibold">Dark Mode</h1>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Sun className="w-5 h-5" />
                    <h1 className="font-semibold">Light Mode</h1>
                  </div>
                )
              }
            </button>
            <button className="w-full flex gap-1 items-center hover:bg-highlight border border-transparent hover:border hover:border-border duration-500 text-red-500 hover:text-red-600 cursor-pointer px-2 py-1 rounded-md" onClick={handleUserLogout}>
              <LogOut className="w-5 h-5" />
              <h1 className="font-semibold">Logout</h1>
            </button>
            {/* Add More Options Below */}
          </div>
        </AccordionContent>
      </Accordion>
    </div>
  );
};

const Header = ({
  onMenuClick,
  children,
}: {
  onMenuClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full h-14 border-b border-b-border p-4 z-10 bg-background flex justify-between items-center gap-5 lg:gap-4">
      <div className="w-full flex items-center gap-1">
        <button
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open Sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

const Layout = ({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="w-full min-h-screen h-full bg-background flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} businessName="OLIVE" />

      {/* Main Content */}
      <div className="w-full h-screen lg:w-5/6 ml-auto bg-background flex flex-col relative z-0 overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)}>{header}</Header>

        {/* Body */}
        <div className="w-full h-full overflow-x-hidden overflow-auto p-4 relative bg-foreground">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
