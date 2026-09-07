"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../lib/auth/AuthContext";
import { RoleName } from "../../../lib/types/auth.types";

interface NavItem {
  label: string;
  href: string;
  roles?: RoleName[]; // undefined = visible to all authenticated roles
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/users", roles: [RoleName.SUPER_ADMIN] },
  { label: "Departments", href: "/departments", roles: [RoleName.SUPER_ADMIN] },
  { label: "Employees", href: "/employees", roles: [RoleName.SUPER_ADMIN] },
  { label: "Clients", href: "/clients", roles: [RoleName.SUPER_ADMIN] },
  { label: "Change Password", href: "/change-password" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <aside className="w-64 min-h-screen bg-base-100 border-r border-base-300 flex flex-col">
      <div className="p-4 border-b border-base-300">
        <h2 className="font-bold text-lg">SBMS Portal</h2>
        {user && (
          <p className="text-sm text-base-content/60 mt-1">
            {user.name} · <span className="badge badge-sm">{user.role}</span>
          </p>
        )}
      </div>

      <ul className="menu p-2 flex-1">
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive ? "active" : ""}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="p-2 border-t border-base-300">
        <button onClick={logout} className="btn btn-outline btn-error w-full">
          Logout
        </button>
      </div>
    </aside>
  );
}