const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  ROOMS: "/rooms"
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
    dashboard: `${ROOTS.DASHBOARD}/users`,
    manageRooms: `${ROOTS.DASHBOARD}/manageRooms`,
    userAddEdit: `${ROOTS.DASHBOARD}/userAddEdit`,
    addEditRooms: `${ROOTS.DASHBOARD}/addEditRooms`,
  },
  rooms: {
    userRoom: `${ROOTS.ROOMS}/userRoom`,
    bookRoom: `${ROOTS.ROOMS}/bookRoom`,
  },
};
