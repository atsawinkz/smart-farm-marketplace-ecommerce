"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, username, password, phone, email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "การสมัครสมาชิกล้มเหลว");
      } else {
        setShowSuccessPopup(true);
      }
    } catch (err) {
      console.error("Register client error:", err);
      setError("ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center font-body-md text-body-md bg-gradient-to-br from-[#eaf2e6] to-[#f8faf6] p-4 md:p-8">
      <div className="bg-surface-container-lowest w-full max-w-[600px] rounded-xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-surface-variant relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-container opacity-10 rounded-tr-full -ml-20 -mb-20 pointer-events-none"></div>

        <Link 
          href="/" 
          className="absolute top-6 right-6 text-outline hover:text-primary hover:bg-surface-container-low transition-colors w-8 h-8 flex items-center justify-center rounded-full z-20 cursor-pointer"
          title="ย้อนกลับ"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </Link>

        <div className="text-center mb-stack-lg relative z-10">
          <h1 className="font-headline-xl-mobile md:font-headline-xl text-primary mb-2">
            Smartket
          </h1>
          <p className="font-body-md text-on-surface-variant">
            สมัครสมาชิกสำหรับผู้ซื้อส่ง
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg text-sm mb-6 flex items-center gap-3 relative z-10">
            <span className="material-symbols-outlined text-[20px] text-red-600">error</span>
            <span>{error}</span>
          </div>
        )}

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
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              disabled={loading}
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center"
                  id="togglePassword"
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                  disabled={loading}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full max-w-[220px] mx-auto bg-primary text-on-primary py-3 rounded-lg font-label-lg hover:bg-surface-tint transition-all flex items-center justify-center gap-2 group mt-6 disabled:opacity-50 cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            {!loading && (
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[20px]">
                arrow_forward
              </span>
            )}
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

      {/* Success Modal Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-[420px] p-8 text-center shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex flex-col items-center gap-5 border border-gray-100 relative">
            
            {/* Logo */}
            <div className="flex flex-col items-center gap-1 mt-2">
              <div className="flex items-center justify-center text-[#1b3322] text-xl font-bold gap-1">
                <span className="material-symbols-outlined text-[#2e7d32] text-[28px]">shopping_cart_checkout</span>
                <span className="font-headline-md tracking-tight text-[#1b3322]">Smartket</span>
              </div>
            </div>

            {/* Check Circle Icon */}
            <div className="w-24 h-24 rounded-full bg-[#e8f5e9] flex items-center justify-center my-2">
              <span className="material-symbols-outlined text-[#2e7d32] text-[56px]">check_circle</span>
            </div>

            {/* Content Text */}
            <div className="space-y-2">
              <h2 className="text-[#1b3322] text-2xl font-bold">
                สมัครสมาชิกสำเร็จ!
              </h2>
              <div className="text-[#5c7268] text-sm leading-relaxed">
                <p>ยินดีต้อนรับเข้าสู่ครอบครัว Smartket</p>
                <p>คุณสามารถเริ่มต้นการสั่งซื้อผลผลิตจากฟาร์มได้ทันที</p>
              </div>
            </div>

            {/* Actions Button */}
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-[#1b3322] hover:bg-[#122417] text-white py-4 px-6 rounded-full font-medium flex items-center justify-center gap-2 transition-colors mt-3 shadow-md shadow-green-900/10 cursor-pointer text-base"
            >
              <span>เข้าสู่ระบบ</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            {/* Footer Shield */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-2">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Verified Secure Account</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
