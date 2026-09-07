import { RoleName } from "../types/auth.types";

/**
 * Central map of which app routes are restricted to which roles.
 * A route not listed here is accessible to any authenticated user.
 * Match is done by "pathname starts with key".
 */
export const ROUTE_ROLE_MAP: { path: string; roles: RoleName[] }[] = [
  { path: "/users", roles: [RoleName.SUPER_ADMIN] },
  { path: "/departments", roles: [RoleName.SUPER_ADMIN] },
  { path: "/employees", roles: [RoleName.SUPER_ADMIN] },
  { path: "/clients", roles: [RoleName.SUPER_ADMIN] },
];

export function getAllowedRolesForPath(pathname: string): RoleName[] | null {
  const match = ROUTE_ROLE_MAP.find((entry) => pathname.startsWith(entry.path));
  return match ? match.roles : null;
}

export function isRouteAllowed(pathname: string, role: RoleName | undefined): boolean {
  const allowedRoles = getAllowedRolesForPath(pathname);
  if (!allowedRoles) return true; // no restriction defined for this route
  if (!role) return false;
  return allowedRoles.includes(role);
}
