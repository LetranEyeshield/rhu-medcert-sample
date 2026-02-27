import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullName: string;
    };
  }

  interface User {
    id: string;
    fullName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    fullName: string;
  }
}