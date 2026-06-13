"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "การเข้าสู่ระบบล้มเหลว");
      } else {
        // Store user state
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      }
    } catch (err) {
      console.error("Login client error:", err);
      setError("ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
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
          
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 text-body-sm font-medium relative z-10 group">
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            ย้อนกลับ
          </Link>

          <div className="text-center mb-stack-lg relative z-10">
            <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary mb-stack-sm">
              Smartket
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              ยินดีต้อนรับ
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg text-sm mb-6 flex items-center gap-3 relative z-10 animate-fade-in">
              <span className="material-symbols-outlined text-[20px] text-red-600">error</span>
              <span>{error}</span>
            </div>
          )}
          
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors"
                  id="togglePassword"
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
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
                  disabled={loading}
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
              className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-lg text-label-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              {!loading && (
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              )}
            </button>

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
