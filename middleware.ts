import NextAuth from "next-auth";

import authConfig from "./lib/db/auth.config";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes
} from "@/lib/db/routes";
const { auth } = NextAuth(authConfig);

export default auth((req) => {    
    const isLoggedIn = !!req.auth;

    const { nextUrl } = req;
    const { pathname } = nextUrl;

    const isApiAuthRoute = apiAuthPrefix.startsWith(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthRoutes = authRoutes.includes(pathname);

    // by default allow all auth routes
    if (isApiAuthRoute) {
        return;
    }

    if (isAuthRoutes) {
        // if already logged in and tried to login, redirect them to default redirect link
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        // allow route if it is auth route
        return;
    }

    // if not logged in and tried to access the routes other than public routes redirect to login page
    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", nextUrl));
    }

    return;
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};