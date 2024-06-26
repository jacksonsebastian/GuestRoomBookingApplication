const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

export const Paths = {
  // Authentication routes
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
  },
  // Dashboard routes
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    two: `${ROOTS.DASHBOARD}/two`,
  },
};
