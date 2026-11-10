import { request, tokenStorage } from "./apiClient";

export const demoAccounts = [
  { label: "Employee", email: "employee@company.com", password: "employee123" },
  { label: "Admin", email: "admin@company.com", password: "admin123" },
];

const AuthService = {
  async login(email, password) {
    const data = await request("/auth/login", { method: "POST", body: { email, password } });
    tokenStorage.set(data.token);
    return data.user;
  },

  async getCurrentUser() {
    const data = await request("/auth/me");
    return data.user;
  },

  logout() {
    tokenStorage.clear();
  },

  hasToken() {
    return Boolean(tokenStorage.get());
  },
};

export default AuthService;
