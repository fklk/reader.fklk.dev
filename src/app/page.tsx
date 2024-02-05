/**
 * === Landing Page ===
 *
 * Purpose: Give information about the application.
 *
 * Conents:
 * - General information
 * - Call to action
 *      - @button signin
 *      - @button signup
 *
 * Redirects:
 * - @authenticated "home"
 */

export default async function LandingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-5xl font-black">Landing Page</h1>
        </div>
    );
}
