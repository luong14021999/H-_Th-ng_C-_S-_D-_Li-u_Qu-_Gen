"use client";

import { useState } from "react";
import Link from "next/link";

const PDFS = [
  { label: "🌾 Cây trồng NN, LN & Dược liệu", file: "/HTcaytrong.pdf" },
  { label: "🐕 Vật nuôi",                       file: "/HTchannuoi.pdf" },
  { label: "🐟 Thủy sản",                        file: "/HTthuy%20san.pdf" },
  { label: "🍄 Vi sinh vật, Nấm",               file: "/HTVSV.pdf" },
];

export default function DanhMucHienTrang() {
  const [active, setActive] = useState(0);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top bar */}
      <div className="bg-green-700 text-white shrink-0 print:hidden">
        <div className="px-3 py-2.5 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium hover:bg-white/20 px-2.5 py-1.5 rounded transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Trang chủ
          </Link>
          <span className="text-white/40 hidden sm:inline">|</span>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wide truncate hidden sm:block">
            Danh mục hiện trạng bảo tồn; khai thác, sử dụng nguồn gen – Tỉnh Thanh Hóa
          </p>
          <a
            href={PDFS[active].file}
            download
            className="ml-auto flex items-center gap-1.5 text-sm font-medium hover:bg-white/20 px-2.5 py-1.5 rounded transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Tải PDF
          </a>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-t border-white/20">
          {PDFS.map((pdf, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                active === i
                  ? "border-white text-white bg-white/10"
                  : "border-transparent text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {pdf.label}
            </button>
          ))}
        </div>
      </div>

      {/* PDF viewer */}
      <div className="flex-1 overflow-hidden">
        <iframe
          key={active}
          src={`${PDFS[active].file}#toolbar=1&navpanes=0&view=FitH`}
          className="w-full h-full border-0"
          title={PDFS[active].label}
        />
      </div>
    </div>
  );
}
