// app/login/page.tsx
import { PawIcon } from '@/components/PawIcon/PawIcon';
import Link from 'next/link';
import { login, signup } from './actions';

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="bg-warm-white min-h-screen flex flex-col items-center justify-center font-nunito px-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-black/5">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 mb-4 animate-wag">
            <PawIcon color="var(--chewy-blue)" opacity={1} />
          </div>
          <h1 className="font-fredoka text-3xl font-semibold text-text-dark text-center">
            Welcome to Scout
          </h1>
          <p className="text-text-mid text-center mt-2">
            Sign in or create an account to start tracking.
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-dark" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="hello@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-page font-nunito text-text-dark focus:outline-none focus:ring-2 focus:ring-chewy-blue/30 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-bold text-text-dark"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-page font-nunito text-text-dark focus:outline-none focus:ring-2 focus:ring-chewy-blue/30 transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-semibold text-center mt-2 bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 mt-4">
            <button
              formAction={login}
              className="w-full bg-chewy-blue hover:bg-chewy-blue-dark text-white font-nunito font-bold px-8 py-4 rounded-full transition-all text-lg shadow-md active:scale-95"
            >
              Sign In
            </button>
            <button
              formAction={signup}
              className="w-full bg-page hover:bg-black/5 text-text-dark font-nunito font-bold px-8 py-4 rounded-full transition-all text-lg active:scale-95"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-black/5 pt-6">
          <Link
            href="/"
            className="text-sm font-semibold text-text-muted hover:text-text-dark transition-colors"
          >
            &larr; Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
