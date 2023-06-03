import { User } from "@/types";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

//https://medium.com/@romeobazil/share-auth-session-between-nextjs-multi-zones-apps-using-nextauth-js-5bab51bb7e31

// This helper function will allows us to get the domain name regardless of its form
// beta.example.com => example.com
// example.com/* => example.com
// localhost:3000 => localhost
const getDomainWithoutSubdomain = (url: string) => {
  const urlParts = new URL(url).hostname.split(".");

  return urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join(".");
};

const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = getDomainWithoutSubdomain(process.env.NEXTAUTH_URL!);

// Define how we want the session token to be stored in our browser
const cookies = {
  sessionToken: {
    name: `${cookiePrefix}next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: useSecureCookies,
      domain: hostName == "localhost" ? hostName : "." + hostName, // add a . in front so that subdomains are included
    },
  },
};

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies,
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        // Add logic here to look up the user from the credentials supplied
        const response = await fetch(
          process.env.NEXT_PUBLIC_URL + "/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              password,
            }),
          }
        );

        if (response.ok) {
          const user = await response.json();
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  cookies,
  pages: {
    signIn: "/",
  },
};
export default NextAuth(authOptions);
