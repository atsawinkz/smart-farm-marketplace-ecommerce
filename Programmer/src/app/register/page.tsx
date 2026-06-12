"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful registration, redirect to login
    router.push("/login");
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center font-body-md text-body-md bg-gradient-to-br from-[#eaf2e6] to-[#f8faf6] p-4 md:p-8">
      <div className="bg-surface-container-lowest w-full max-w-[600px] rounded-xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-surface-variant relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-container opacity-10 rounded-tr-full -ml-20 -mb-20 pointer-events-none"></div>

        <div className="text-center mb-stack-lg relative z-10">
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-primary mb-2">
            Smartket
          </h1>
          <p className="font-body-md text-on-surface-variant">
            สมัครสมาชิกสำหรับผู้ซื้อส่ง
          </p>
        </div>

        <form className="space-y-stack-md relative z-10" onSubmit={handleRegister}>
          {/* Full Name */}
          <div>
            <label
              className="block font-label-lg text-on-surface mb-2"
              htmlFor="fullname"
            >
              ชื่อ-นามสกุล <span className="text-error">*</span>
            </label>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface font-body-md"
              id="fullname"
              name="fullname"
              placeholder="ชื่อ-นามสกุล"
              type="text"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label
                className="block font-label-lg text-on-surface mb-2"
                htmlFor="username"
              >
                ชื่อผู้ใช้งาน <span className="text-error">*</span>
              </label>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface font-body-md"
                id="username"
                name="username"
                placeholder="ชื่อผู้ใช้งาน"
                type="text"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block font-label-lg text-on-surface mb-2"
                htmlFor="password"
              >
                รหัสผ่าน <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface font-body-md"
                  id="password"
                  name="password"
                  placeholder="รหัสผ่าน"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center"
                  id="togglePassword"
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label
              className="block font-label-lg text-on-surface mb-2"
              htmlFor="phone"
            >
              เบอร์โทรศัพท์ <span className="text-error">*</span>
            </label>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface font-body-md"
              id="phone"
              name="phone"
              placeholder="เบอร์โทรศัพท์"
              type="tel"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block font-label-lg text-on-surface mb-2"
              htmlFor="email"
            >
              อีเมล <span className="text-error">*</span>
            </label>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface font-body-md"
              id="email"
              name="email"
              placeholder="อีเมล"
              type="email"
              required
            />
          </div>



          {/* Submit Button */}
          <button
            className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-lg hover:bg-surface-tint transition-all flex items-center justify-center gap-2 group mt-6"
            type="submit"
          >
            สมัครสมาชิก
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[20px]">
              arrow_forward
            </span>
          </button>

          {/* Footer Link */}
          <div className="text-center pt-6 mt-2">
            <p className="font-label-md text-on-surface-variant">
              มีบัญชีอยู่แล้ว?{" "}
              <Link
                className="text-primary font-label-lg hover:underline ml-1"
                href="/login"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
