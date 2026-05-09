"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { CATEGORIES } from "@/data/nguonGen";

interface HeaderProps {
  isAdmin: boolean;
  showNav: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAdminClick: () => void;
  onLogout: () => void;
  onMenuToggle: () => void;
  onOpenAdmin: () => void;
  onNguonGenCategorySelect: (categoryId: string) => void;
}

const NAV_TABS = [
  {
    id: "trang-chu",
    label: "Trang chủ",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    iconSm: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "danh-muc",
    label: "Danh mục",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    iconSm: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: "thong-ke",
    label: "Thống kê",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    iconSm: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const USER_MENU = [
  { id: "admin", label: "Quản trị dữ liệu", danger: false },
  { id: "profile", label: "Thông tin cá nhân", danger: false },
  { id: "password", label: "Đổi mật khẩu", danger: false },
  { id: "guide", label: "Hướng dẫn sử dụng", danger: false },
  { id: "logout", label: "Đăng xuất", danger: true },
];

export default function Header({
  isAdmin, showNav, activeTab, onTabChange, onAdminClick,
  onLogout, onMenuToggle, onOpenAdmin, onNguonGenCategorySelect,
}: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userMenuPos, setUserMenuPos] = useState({ top: 0, right: 0 });

  const [nguonGenOpen, setNguonGenOpen] = useState(false);
  const [nguonGenPos, setNguonGenPos] = useState({ top: 0, left: 0 });

  const [mobileGenSheetOpen, setMobileGenSheetOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  const userTriggerRef = useRef<HTMLButtonElement>(null);
  const nguonGenRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleToggleUserMenu = () => {
    if (!userMenuOpen && userTriggerRef.current) {
      const r = userTriggerRef.current.getBoundingClientRect();
      setUserMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    }
    setUserMenuOpen((v) => !v);
  };

  const handleUserMenuAction = (id: string) => {
    setUserMenuOpen(false);
    if (id === "logout") onLogout();
    else if (id === "admin") onOpenAdmin();
  };

  const handleNguonGenToggle = () => {
    if (!nguonGenOpen && nguonGenRef.current) {
      const r = nguonGenRef.current.getBoundingClientRect();
      setNguonGenPos({ top: r.bottom, left: r.left });
    }
    setNguonGenOpen((v) => !v);
  };

  const handleCategorySelect = (categoryId: string) => {
    setNguonGenOpen(false);
    setMobileGenSheetOpen(false);
    onNguonGenCategorySelect(categoryId);
    onTabChange("nguon-gen");
  };

  const isNguonGenActive = activeTab === "nguon-gen";

  return (
    <>
      <header className="shrink-0 relative z-30 shadow-lg">
        {/* Top bar */}
        <div className="bg-green-700 text-white px-3 sm:px-5 py-2 flex items-center justify-between gap-3">
          {/* Left: mobile toggle + logo + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-1.5 rounded hover:bg-white/20 transition-colors shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="w-11 h-11 rounded-full overflow-hidden bg-white shrink-0 ring-2 ring-white/30">
              <Image src="/logo.png" alt="Logo" width={52} height={52} className="w-full h-full object-cover" />
            </div>

            <div className="min-w-0">
              <p className="font-bold text-sm sm:text-base leading-tight truncate">
                Viện nông nghiệp thanh hoá
              </p>
              <p className="text-xs text-white/60 italic hidden sm:block truncate">
                Hệ thống cơ sở dữ liệu quỹ gen tỉnh Thanh Hóa
              </p>
            </div>
          </div>

          {/* Right: gear + user */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button className="p-2 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {isAdmin ? (
              <button
                ref={userTriggerRef}
                onClick={handleToggleUserMenu}
                className="flex items-center gap-2 hover:bg-white/10 px-2.5 py-1.5 rounded transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium hidden sm:inline">Quản trị dữ liệu</span>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Đăng nhập</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop nav tab bar — hidden on mobile */}
        {showNav && (
          <div className="max-md:hidden bg-green-800 flex overflow-x-auto">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-white text-white bg-white/10"
                    : "border-transparent text-white/65 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.iconSm}
                {tab.label}
              </button>
            ))}

            {/* Nguồn gen — dropdown tab */}
            <button
              ref={nguonGenRef}
              onClick={handleNguonGenToggle}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                isNguonGenActive
                  ? "border-white text-white bg-white/10"
                  : "border-transparent text-white/65 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Nguồn gen
              <svg
                className={`w-3.5 h-3.5 text-white/60 transition-transform ${nguonGenOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </header>

      {/* ── Mobile bottom nav bar ── */}
      {showNav && mounted && createPortal(
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex safe-area-pb">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                activeTab === tab.id ? "text-green-700" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}

          {/* Nguồn gen */}
          <button
            onClick={() => setMobileGenSheetOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
              isNguonGenActive ? "text-green-700" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-[10px] font-medium">Nguồn gen</span>
          </button>
        </nav>,
        document.body
      )}

      {/* ── Mobile Nguồn gen bottom sheet ── */}
      {mounted && mobileGenSheetOpen && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[9998]"
            onClick={() => setMobileGenSheetOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-2xl overflow-hidden pb-safe">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nhóm nguồn gen</p>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="w-full text-left px-5 py-3.5 text-sm flex items-center gap-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-0 text-gray-700"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
            <div className="h-4" />
          </div>
        </>,
        document.body
      )}

      {/* User menu portal */}
      {mounted && userMenuOpen && createPortal(
        <>
          <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setUserMenuOpen(false)} />
          <div
            className="fixed bg-white text-gray-800 shadow-xl rounded-lg w-52 overflow-hidden border border-gray-200"
            style={{ top: userMenuPos.top, right: userMenuPos.right, zIndex: 9999 }}
          >
            {USER_MENU.map((menuItem) => (
              <button
                key={menuItem.id}
                onClick={() => handleUserMenuAction(menuItem.id)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-gray-100 last:border-0 ${
                  menuItem.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {menuItem.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}

      {/* Desktop Nguồn gen category dropdown portal */}
      {mounted && nguonGenOpen && createPortal(
        <>
          <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setNguonGenOpen(false)} />
          <div
            className="fixed bg-white shadow-xl rounded-lg w-56 overflow-hidden border border-gray-200"
            style={{ top: nguonGenPos.top, left: nguonGenPos.left, zIndex: 9999 }}
          >
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nhóm nguồn gen</p>
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-0 text-gray-700 hover:text-green-800"
              >
                <span className="text-base">{cat.icon}</span>
                <span className="font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
