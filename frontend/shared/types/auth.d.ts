declare module '#auth-utils' {
  interface User {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    isActive: boolean;
    isStaff: boolean;
    isSuperuser: boolean;
  }
  interface UserSession {
    // Public user profile (matches your Django response)
    user: User;
    // Private server-side tokens
    secure: {
      token: string;
      refresh: string;
    }
  }
}

export {}
