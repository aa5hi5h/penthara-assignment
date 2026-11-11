import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/cn";

const linkClass = ({ isActive }) =>
  cn("text-sm transition-colors hover:text-foreground", isActive ? "font-medium text-foreground" : "text-muted-foreground");

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <span className="font-semibold tracking-tight">Leave Management</span>
            <nav className="flex items-center gap-4">
              <NavLink to="/" end className={linkClass}>
                Dashboard
              </NavLink>
              {user.role === "ADMIN" && (
                <NavLink to="/admin" className={linkClass}>
                  Requests
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Badge variant="secondary">{user.role === "ADMIN" ? "Admin" : "Employee"}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
