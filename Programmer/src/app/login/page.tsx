"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirect to the homepage on login
    router.push("/");
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md text-body-md bg-gradient-to-br from-[#eaf2e6] to-[#f8faf6]">
      <nav className="w-full top-0 sticky bg-background bg-opacity-90 backdrop-blur-md z-50 flat no-shadows">
        <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">
          <div className="hidden md:flex gap-gutter items-center">
            {/* Navigation links can be added here */}
          </div>
          <div className="flex gap-stack-md items-center">
            <button className="md:hidden text-primary">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="bg-surface-container-lowest w-full max-w-[480px] rounded-xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-surface-variant relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-container opacity-10 rounded-tr-full -ml-20 -mb-20 pointer-events-none"></div>
          
          <div className="text-center mb-stack-lg relative z-10">
            <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary mb-stack-sm">
              Smartket
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              ยินดีต้อนรับสู่โลกแห่งเกษตรขายส่ง
            </p>
          </div>

          <form className="space-y-stack-md relative z-10" onSubmit={handleLogin}>
            <div>
              <label
                className="block font-label-lg text-label-lg text-on-surface mb-2"
                htmlFor="username"
              >
                ชื่อผู้ใช้งาน
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                  person
                </span>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface font-body-md text-body-md"
                  id="username"
                  name="username"
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  type="text"
                />
              </div>
            </div>

            <div>
              <label
                className="block font-label-lg text-label-lg text-on-surface mb-2"
                htmlFor="password"
              >
                รหัสผ่าน
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                  lock
                </span>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-12 pr-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface font-body-md text-body-md"
                  id="password"
                  name="password"
                  placeholder="กรอกรหัสผ่าน"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors"
                  id="togglePassword"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  <span className="material-symbols-outlined" id="visibilityIcon">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pb-stack-sm pt-stack-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest w-4 h-4 cursor-pointer"
                  type="checkbox"
                />
                <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                  จดจำฉันไว้ในระบบ
                </span>
              </label>
              <Link
                className="font-label-md text-label-md text-primary hover:underline"
                href="#"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>

            <button
              className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-lg text-label-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group"
              type="submit"
            >
              เข้าสู่ระบบ
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            <div className="space-y-stack-md mt-stack-md">
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-surface-variant"></div>
                <span className="flex-shrink mx-4 text-label-md text-on-surface-variant">
                  หรือเข้าสู่ระบบด้วย
                </span>
                <div className="flex-grow border-t border-surface-variant"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors font-label-lg text-label-lg text-on-surface"
                  type="button"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                  Google
                </button>
                <button
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#1877F2] hover:opacity-90 transition-opacity font-label-lg text-label-lg text-white"
                  type="button"
                >
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                  Facebook
                </button>
              </div>
            </div>

            <div className="text-center pt-stack-md border-t border-surface-variant mt-stack-md">
              <p className="font-body-md text-body-md text-on-surface-variant">
                ยังไม่มีบัญชี?{" "}
                <Link
                  className="text-primary font-label-lg text-label-lg hover:underline ml-1"
                  href="/register"
                >
                  สมัครสมาชิก
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      <footer className="w-full mt-auto bg-surface-container-low">
        <div className="flex flex-col md:flex-row justify-between items-center gap-stack-md max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
          <div className="font-headline-md text-headline-md text-primary">
            Smartket
          </div>
          <div className="flex flex-wrap justify-center gap-gutter font-label-md text-label-md">
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors focus:underline"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors focus:underline"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors focus:underline"
              href="#"
            >
              Shipping Info
            </Link>
            <Link
              className="text-on-surface-variant hover:text-primary transition-colors focus:underline"
              href="#"
            >
              Contact Us
            </Link>
          </div>
          <div className="text-on-surface-variant font-body-md text-body-md text-center md:text-right">
            © 2024 Smartket. Modern Agronomy for a Healthy Planet.
          </div>
        </div>
      </footer>
    </div>
  );
}
