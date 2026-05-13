"use client";

import { useRouter, useParams } from "next/navigation";

const LOAI_MAP: Record<string, { pdf: string; title: string }> = {
  tt:  { pdf: "/HTcaytrong.pdf",    title: "Bản đồ phân bố nguồn gen cây trồng có giá trị – Tỉnh Thanh Hóa 2023" },
  ln:  { pdf: "/HTcaytrong.pdf",    title: "Bản đồ phân bố nguồn gen cây trồng có giá trị – Tỉnh Thanh Hóa 2023" },
  dl:  { pdf: "/HTcaytrong.pdf",    title: "Bản đồ phân bố nguồn gen cây trồng có giá trị – Tỉnh Thanh Hóa 2023" },
  cn:  { pdf: "/HTchannuoi.pdf",    title: "Bản đồ phân bố nguồn gen vật nuôi có giá trị – Tỉnh Thanh Hóa 2023" },
  ts:  { pdf: "/HTthuy san.pdf",    title: "Bản đồ phân bố nguồn gen thủy sản có giá trị – Tỉnh Thanh Hóa 2023" },
  vs:  { pdf: "/HTVSV.pdf",         title: "Bản đồ phân bố nguồn gen vi sinh vật, nấm – Tỉnh Thanh Hóa 2023" },
};

export default function BanDoPage() {
  const router = useRouter();
  const params = useParams();
  const loai = (params?.loai as string)?.toLowerCase() ?? "";
  const info = LOAI_MAP[loai];

  if (!info) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Không tìm thấy bản đồ</p>
          <button onClick={() => router.back()} className="underline text-blue-300">Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>
        <span className="text-white font-semibold text-sm text-center px-4">{info.title}</span>
        <div className="w-16" />
      </div>
      <iframe
        src={info.pdf}
        className="flex-1 w-full"
        title={info.title}
      />
    </div>
  );
}
