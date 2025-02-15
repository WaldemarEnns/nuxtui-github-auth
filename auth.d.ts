declare module '#auth-utils' {
  interface User {
    avatar_url: string|null;
    email: string;
    name: string;
    url: string;
    id: number;
  }
}

export {}