"use client";

import Image from "next/image";

interface HeaderProps {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
}

export default function Header({ isAdmin, onAdminClick, onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-teal-800 text-white shrink-0 z-10 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="font-bold text-sm leading-tight uppercase tracking-wide">
            Hệ Thống Cơ Sở Dữ Liệu Quỹ Gen
          </h1>
          <p className="text-teal-200 text-xs">Tỉnh Thanh Hóa</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isAdmin ? (
          <>
            <span className="text-xs text-teal-200 hidden sm:block">Đã đăng nhập</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </button>
          </>
        ) : (
          <button
            onClick={onAdminClick}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Admin
          </button>
        )}
      </div>
    </header>
  );
}
