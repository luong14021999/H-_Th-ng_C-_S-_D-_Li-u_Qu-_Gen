"use client";

import Image from "next/image";

interface HeaderProps {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  onMenuToggle: () => void;
}

export default function Header({ isAdmin, onAdminClick, onLogout, onMenuToggle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-3 py-2 bg-green-700 text-white shrink-0 z-10 shadow-md">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 rounded hover:bg-white/20 transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 bg-white">
          <Image src="/logo.png" alt="Logo" width={56} height={56} className="w-full h-full object-cover" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-white/90 hidden sm:block truncate">
            VIỆN NÔNG NGHIỆP THANH HOÁ
          </p>
          <h1 className="font-bold leading-tight uppercase tracking-wide truncate text-sm md:text-lg">
            <span className="hidden sm:inline">Hệ Thống Cơ Sở Dữ Liệu Quỹ Gen Tỉnh Thanh Hóa</span>
            <span className="sm:hidden">CSDL Quỹ Gen Thanh Hóa</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {isAdmin ? (
          <>
            <span className="text-xs text-green-100 hidden lg:block">Đã đăng nhập</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-2.5 py-1.5 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </>
        ) : (
          <button
            onClick={onAdminClick}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-2.5 py-1.5 rounded transition-colors"
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
