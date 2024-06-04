/**
 * An `array of routes` that are accessible to the `public`.
 * These routes does not require Authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/", "/profile"];

/**
 * An `array of routes` that are used for `authentication`.
 * @type {string[]}
 */
export const authRoutes: string[] = [
    "/login",
    "/register",
];

/**
 * A `string` containing prefix used in `API authentication`.
 * Routes starting with this prefix are used for `API authentication`
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * The `default url` to redirect after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";