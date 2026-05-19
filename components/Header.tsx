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
  onOpenGuide: () => void;
  onNguonGenCategorySelect: (categoryId: string) => void;
  onThongKeSelect?: (id: string) => void;
  onDanhMucSelect?: (id: string) => void;
}

const USER_MENU = [
  { id: "admin", label: "Quản trị dữ liệu", danger: false },
  { id: "guide", label: "Hướng dẫn sử dụng", danger: false },
  { id: "logout", label: "Đăng xuất", danger: true },
];

const DANH_MUC_ITEMS = [
  { id: "dm-nhom-nguon-gen", label: "Nhóm nguồn gen" },
  { id: "dm-don-vi-sx", label: "Đơn vị sản xuất cung cấp gen giống" },
  { id: "dm-phuong-thuc-bao-ton", label: "Phương thức bảo tồn" },
  { id: "dm-hinh-thuc-khai-thac", label: "Hình thức khai thác sử dụng" },
  { id: "dm-hinh-thuc-bao-ton", label: "Hình thức bảo tồn" },
  { id: "dm-bai-viet", label: "Bài viết khai thác, bảo tồn, sử dụng" },
];

const THONG_KE_ITEMS = [
  { id: "tk-don-vi-quan-ly", label: "Nguồn gen theo đơn vị quản lý" },
  { id: "tk-don-vi-hc", label: "Nguồn gen theo đơn vị hành chính" },
  { id: "tk-nhom", label: "Nguồn gen theo nhóm nguồn gen" },
];

// Shared SVG icons
const IconHome = ({ cls = "w-5 h-5" }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const IconChart = ({ cls = "w-5 h-5" }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const IconShield = ({ cls = "w-5 h-5" }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconPerson = ({ cls = "w-5 h-5" }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconFolder = ({ cls = "w-5 h-5" }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
  </svg>
);

export default function Header({
  isAdmin, showNav, activeTab,
  onTabChange, onAdminClick, onLogout, onMenuToggle, onOpenAdmin, onOpenGuide, onNguonGenCategorySelect, onThongKeSelect, onDanhMucSelect,
}: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userMenuPos, setUserMenuPos] = useState({ top: 0, right: 0 });
  const [nguonGenOpen, setNguonGenOpen] = useState(false);
  const [nguonGenPos, setNguonGenPos] = useState({ top: 0, left: 0 });
  const [danhMucOpen, setDanhMucOpen] = useState(false);
  const [danhMucPos, setDanhMucPos] = useState({ top: 0, left: 0 });
  const [thongKeOpen, setThongKeOpen] = useState(false);
  const [thongKePos, setThongKePos] = useState({ top: 0, left: 0 });
  const [mobileGenSheetOpen, setMobileGenSheetOpen] = useState(false);
  const [mobileThongKeSheetOpen, setMobileThongKeSheetOpen] = useState(false);
  const [mobileDanhMucSheetOpen, setMobileDanhMucSheetOpen] = useState(false);
  const [mobileUserSheetOpen, setMobileUserSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const userTriggerRef = useRef<HTMLButtonElement>(null);
  const nguonGenRef = useRef<HTMLButtonElement>(null);
  const danhMucRef = useRef<HTMLButtonElement>(null);
  const thongKeRef = useRef<HTMLButtonElement>(null);

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
    else if (id === "guide") onOpenGuide();
  };

  const handleNguonGenToggle = () => {
    if (!nguonGenOpen && nguonGenRef.current) {
      const r = nguonGenRef.current.getBoundingClientRect();
      setNguonGenPos({ top: r.bottom, left: r.left });
    }
    setNguonGenOpen((v) => !v);
    setDanhMucOpen(false);
    setThongKeOpen(false);
  };

  const handleDanhMucToggle = () => {
    if (!danhMucOpen && danhMucRef.current) {
      const r = danhMucRef.current.getBoundingClientRect();
      setDanhMucPos({ top: r.bottom, left: r.left });
    }
    setDanhMucOpen((v) => !v);
    setNguonGenOpen(false);
    setThongKeOpen(false);
  };

  const handleThongKeToggle = () => {
    if (!thongKeOpen && thongKeRef.current) {
      const r = thongKeRef.current.getBoundingClientRect();
      setThongKePos({ top: r.bottom, left: r.left });
    }
    setThongKeOpen((v) => !v);
    setNguonGenOpen(false);
    setDanhMucOpen(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    setNguonGenOpen(false);
    setMobileGenSheetOpen(false);
    onNguonGenCategorySelect(categoryId);
  };

  const isNguonGenActive = activeTab === "nguon-gen";

  // Mobile bottom nav tabs
  const adminTabs = [
    { id: "trang-chu", label: "Trang chủ", icon: <IconHome />, action: () => onTabChange("trang-chu") },
    { id: "danh-muc", label: "Danh mục", icon: <IconFolder />, action: () => isAdmin ? setMobileDanhMucSheetOpen(true) : onAdminClick() },
    { id: "thong-ke", label: "Thống kê", icon: <IconChart />, action: () => setMobileThongKeSheetOpen(true) },
    { id: "nguon-gen", label: "Nguồn gen", icon: <IconShield />, action: () => setMobileGenSheetOpen(true) },
    { id: "tai-khoan", label: "Tài khoản", icon: <IconPerson />, action: () => setMobileUserSheetOpen(true) },
  ];
  const guestTabs = [
    { id: "trang-chu", label: "Bản đồ", icon: <IconHome />, action: () => onTabChange("trang-chu") },
    { id: "login", label: "Đăng nhập", icon: <IconPerson />, action: onAdminClick },
  ];
  const bottomTabs = isAdmin ? adminTabs : guestTabs;

  return (
    <>
      <header className="shrink-0 z-30 shadow-lg bg-green-700">
        {/* ── Main top bar ── */}
        <div className="text-white px-3 py-2 flex items-center gap-3">
          {/* Hamburger (mobile, map sidebar) */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-1.5 rounded hover:bg-white/20 transition-colors shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white shrink-0 ring-2 ring-white/30">
            <Image src="/logo.png" alt="Logo" width={56} height={56} className="w-full h-full object-cover" />
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-sm sm:text-base md:text-lg leading-tight uppercase tracking-wide">
              Hệ thống cơ sở dữ liệu quỹ gen tỉnh Thanh Hóa
            </p>
            <p className="text-xs text-white/60 hidden sm:block italic">Viện nông nghiệp Thanh Hoá</p>
          </div>

          {/* Right: count + user — hidden on mobile (bottom nav handles it) */}
          <div className="max-md:hidden flex items-center gap-2 shrink-0">

            {isAdmin ? (
              <button
                ref={userTriggerRef}
                onClick={handleToggleUserMenu}
                className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-1.5 rounded transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <IconPerson cls="w-5 h-5" />
                </div>
                <span className="text-sm font-medium hidden sm:inline">Quản trị</span>
                <svg className="w-4 h-4 text-white/60 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
              >
                <IconPerson cls="w-4 h-4" />
                Đăng nhập
              </button>
            )}
          </div>
        </div>

        {/* ── Desktop nav tab bar ── */}
        {showNav && (
          <div className="max-md:hidden bg-green-800 flex overflow-x-auto">
            {/* Trang chủ */}
            <button
              onClick={() => onTabChange("trang-chu")}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === "trang-chu"
                  ? "border-white text-white bg-white/10"
                  : "border-transparent text-white/65 hover:text-white hover:bg-white/10"
              }`}
            >
              <IconHome cls="w-4 h-4" />
              Trang chủ
            </button>

            {/* Danh mục — dropdown */}
            <button
              ref={danhMucRef}
              onClick={handleDanhMucToggle}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === "danh-muc"
                  ? "border-white text-white bg-white/10"
                  : "border-transparent text-white/65 hover:text-white hover:bg-white/10"
              }`}
            >
              <IconFolder cls="w-4 h-4" />
              Danh mục
              <svg className={`w-3.5 h-3.5 text-white/60 transition-transform ${danhMucOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Thống kê — dropdown */}
            <button
              ref={thongKeRef}
              onClick={handleThongKeToggle}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === "thong-ke"
                  ? "border-white text-white bg-white/10"
                  : "border-transparent text-white/65 hover:text-white hover:bg-white/10"
              }`}
            >
              <IconChart cls="w-4 h-4" />
              Thống kê
              <svg className={`w-3.5 h-3.5 text-white/60 transition-transform ${thongKeOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Nguồn gen — dropdown */}
            <button
              ref={nguonGenRef}
              onClick={handleNguonGenToggle}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                isNguonGenActive
                  ? "border-white text-white bg-white/10"
                  : "border-transparent text-white/65 hover:text-white hover:bg-white/10"
              }`}
            >
              <IconShield cls="w-4 h-4" />
              Nguồn gen
              <svg className={`w-3.5 h-3.5 text-white/60 transition-transform ${nguonGenOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </header>

      {/* ── Mobile bottom nav — always visible ── */}
      {mounted && createPortal(
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex bg-green-700"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {bottomTabs.map((tab) => {
            const isActive = activeTab === tab.id || (tab.id === "nguon-gen" && isNguonGenActive);
            return (
              <button
                key={tab.id}
                onClick={tab.action}
                className={`relative flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors min-h-[3rem] touch-manipulation ${
                  isActive ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                <div className={`${isActive ? "opacity-100" : "opacity-60"}`}>{tab.icon}</div>
                <span className="text-[11px] font-medium leading-none">{tab.label}</span>
                {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full" />}
              </button>
            );
          })}
        </nav>,
        document.body
      )}

      {/* ── Mobile Nguồn gen bottom sheet ── */}
      {mounted && mobileGenSheetOpen && createPortal(
        <>
          <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={() => setMobileGenSheetOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-2xl overflow-hidden">
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
                  className="w-full text-left px-5 py-3.5 text-sm flex items-center gap-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-0 text-gray-700 touch-manipulation"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
            <div className="safe-area-bottom" />
          </div>
        </>,
        document.body
      )}

      {/* ── Mobile Thống kê bottom sheet ── */}
      {mounted && mobileThongKeSheetOpen && createPortal(
        <>
          <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={() => setMobileThongKeSheetOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-2xl overflow-hidden">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thống kê</p>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {THONG_KE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setMobileThongKeSheetOpen(false);
                    onTabChange("thong-ke");
                    onThongKeSelect?.(item.id);
                  }}
                  className="w-full text-left px-5 py-3.5 text-sm flex items-center gap-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-0 text-gray-700 touch-manipulation"
                >
                  <IconChart cls="w-5 h-5 text-green-600 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="safe-area-bottom" />
          </div>
        </>,
        document.body
      )}

      {/* ── Mobile Danh mục bottom sheet ── */}
      {mounted && mobileDanhMucSheetOpen && createPortal(
        <>
          <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={() => setMobileDanhMucSheetOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-2xl overflow-hidden">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</p>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {DANH_MUC_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setMobileDanhMucSheetOpen(false);
                    onTabChange("danh-muc");
                    onDanhMucSelect?.(item.id);
                  }}
                  className="w-full text-left px-5 py-3.5 text-sm flex items-center gap-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-0 text-gray-700 touch-manipulation"
                >
                  <IconFolder cls="w-5 h-5 text-green-600 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="safe-area-bottom" />
          </div>
        </>,
        document.body
      )}

      {/* ── Mobile Tài khoản bottom sheet ── */}
      {mounted && mobileUserSheetOpen && createPortal(
        <>
          <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={() => setMobileUserSheetOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-2xl overflow-hidden">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tài khoản quản trị</p>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {USER_MENU.map((menuItem) => (
                <button
                  key={menuItem.id}
                  onClick={() => { setMobileUserSheetOpen(false); handleUserMenuAction(menuItem.id); }}
                  className={`w-full text-left px-5 py-3.5 text-sm transition-colors border-b border-gray-100 last:border-0 touch-manipulation ${
                    menuItem.danger ? "text-red-600 hover:bg-red-50" : "hover:bg-green-50 text-gray-700"
                  }`}
                >
                  {menuItem.label}
                </button>
              ))}
            </div>
            <div className="safe-area-bottom" />
          </div>
        </>,
        document.body
      )}

      {/* ── User menu portal ── */}
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
                  menuItem.danger ? "text-red-600 hover:bg-red-50" : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {menuItem.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}

      {/* ── Desktop Nguồn gen dropdown portal ── */}
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

      {/* ── Desktop Danh mục dropdown portal ── */}
      {mounted && danhMucOpen && createPortal(
        <>
          <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setDanhMucOpen(false)} />
          <div
            className="fixed bg-white shadow-xl rounded-lg w-72 overflow-hidden border border-gray-200"
            style={{ top: danhMucPos.top, left: danhMucPos.left, zIndex: 9999 }}
          >
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</p>
            </div>
            {DANH_MUC_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setDanhMucOpen(false); onTabChange("danh-muc"); onDanhMucSelect?.(item.id); }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-green-50 transition-colors border-b border-gray-100 last:border-0 text-gray-700 hover:text-green-800"
              >
                {item.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}

      {/* ── Desktop Thống kê dropdown portal ── */}
      {mounted && thongKeOpen && createPortal(
        <>
          <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setThongKeOpen(false)} />
          <div
            className="fixed bg-white shadow-xl rounded-lg w-72 overflow-hidden border border-gray-200"
            style={{ top: thongKePos.top, left: thongKePos.left, zIndex: 9999 }}
          >
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thống kê</p>
            </div>
            {THONG_KE_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setThongKeOpen(false); onTabChange("thong-ke"); onThongKeSelect?.(item.id); }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-green-50 transition-colors border-b border-gray-100 last:border-0 text-gray-700 hover:text-green-800"
              >
                {item.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
