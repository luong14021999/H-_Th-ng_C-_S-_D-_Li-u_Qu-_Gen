"use client";

import { Fragment, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BAI_VIET_DATA } from "@/data/baiVietData";

const NHOM_SECTIONS = [
  { id: "TT", roman: "I",   label: "CÂY TRỒNG NÔNG NGHIỆP" },
  { id: "LN", roman: "II",  label: "CÂY LÂM NGHIỆP" },
  { id: "DL", roman: "III", label: "CÂY DƯỢC LIỆU" },
  { id: "CN", roman: "IV",  label: "VẬT NUÔI" },
  { id: "TS", roman: "V",   label: "THỦY SẢN" },
  { id: "VS", roman: "VI",  label: "VI SINH VẬT, NẤM" },
];

interface BaiVietRow {
  id: string; nhom: string; ten: string; khoa_hoc: string;
  dang_mau: string; tu_lieu: string; dg_ban_dau: string; dg_chi_tiet: string;
  chua_bt: string; pt_bt: string; ht_bt: string; noi_bt: string; dv_bt: string;
  chua_kt: string; ht_kt: string; dia_diem: string; dv_kt: string; ghi_chu: string;
}

const TH = "border border-gray-400 px-2 py-1.5 text-center text-[13px] font-semibold leading-tight align-middle bg-gray-50";
const TD = "border border-gray-300 px-1.5 py-1 text-[13px] leading-tight align-middle";

export default function BaiVietPublicPage() {
  const [tieuDe, setTieuDe] = useState(
    "DANH MỤC HIỆN TRẠNG BẢO TỒN; KHAI THÁC, SỬ DỤNG NGUỒN GEN TRÊN ĐỊA BÀN TỈNH THANH HÓA"
  );
  const [moTa, setMoTa] = useState("");
  const [rows, setRows] = useState<BaiVietRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bai-viet")
      .then((r) => r.json())
      .then(({ rows: dbRows, meta }: { rows: BaiVietRow[]; meta: Record<string, string> }) => {
        const src = dbRows.length > 0
          ? dbRows
          : BAI_VIET_DATA.map((r) => ({ ...r, id: String(r.tt) })) as BaiVietRow[];
        setRows([...src].sort((a, b) => a.ten.localeCompare(b.ten, "vi")));
        if (meta?.tieu_de) setTieuDe(meta.tieu_de);
        if (meta?.mo_ta)   setMoTa(meta.mo_ta);
      })
      .catch(() => {
        setRows(
          [...BAI_VIET_DATA]
            .sort((a, b) => a.ten.localeCompare(b.ten, "vi"))
            .map((r) => ({ ...r, id: String(r.tt) })) as BaiVietRow[]
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    let offset = 0;
    return NHOM_SECTIONS.map((s) => {
      const sRows = rows.filter((r) => r.nhom === s.id);
      const start = offset;
      offset += sRows.length;
      return { ...s, rows: sRows, start };
    });
  }, [rows]);

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-white gap-3">
        <svg className="w-6 h-6 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-sm text-gray-500">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="h-dvh overflow-y-auto bg-white">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 shadow-sm print:hidden">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 min-w-0">
          <Link href="/" className="hover:text-green-700 hover:underline transition-colors shrink-0">
            Trang chủ
          </Link>
          <span className="text-gray-300 shrink-0">›</span>
          <span className="text-gray-700 font-medium truncate hidden sm:block">{tieuDe}</span>
        </nav>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded px-3 py-1.5 transition-colors shrink-0 print:hidden"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span className="hidden sm:inline">In</span>
        </button>
      </div>

      {/* ── Content ── */}
      <div className="px-3 sm:px-8 py-4 sm:py-6 max-w-[1400px] mx-auto">
        {/* Title */}
        <h1 className="text-base sm:text-xl font-bold uppercase text-center mb-1 leading-snug">{tieuDe}</h1>
        {moTa && <p className="text-center text-xs sm:text-sm italic text-gray-500 mb-4">{moTa}</p>}

        {/* Table — horizontal scroll on mobile */}
        <div className="overflow-x-auto mt-4 -mx-3 sm:mx-0 px-3 sm:px-0">
          <table className="border-collapse w-full" style={{ fontSize: 13 }}>
            <colgroup>
              <col style={{ width: 34 }} /><col style={{ width: 140 }} /><col style={{ width: 166 }} />
              <col style={{ width: 76 }} /><col style={{ width: 58 }} /><col style={{ width: 60 }} />
              <col style={{ width: 60 }} /><col style={{ width: 66 }} /><col style={{ width: 86 }} />
              <col style={{ width: 86 }} /><col style={{ width: 86 }} /><col style={{ width: 86 }} />
              <col style={{ width: 73 }} /><col style={{ width: 86 }} /><col style={{ width: 99 }} />
              <col style={{ width: 86 }} /><col style={{ width: 60 }} />
            </colgroup>
            <thead>
              <tr>
                <th rowSpan={4} className={TH}>TT<br /><span className="font-normal text-[10px]">(A)</span></th>
                <th rowSpan={4} className={TH}>Tên Việt Nam<br /><span className="font-normal text-[10px]">(B)</span></th>
                <th rowSpan={4} className={TH}>Tên khoa học<br /><span className="font-normal text-[10px]">(C)</span></th>
                <th rowSpan={4} className={TH}>Dạng mẫu<br />thu thập<br /><span className="font-normal text-[10px]">(1)</span></th>
                <th rowSpan={4} className={TH}>Tư liệu hóa<br /><span className="font-normal text-[10px]">(2)</span></th>
                <th colSpan={2} className={TH}>Đánh giá nguồn gen</th>
                <th colSpan={5} className={TH}>Hiện trạng bảo tồn</th>
                <th colSpan={4} className={TH}>Hiện trạng khai thác, sử dụng</th>
                <th rowSpan={4} className={TH}>Ghi chú<br /><span className="font-normal text-[10px]">(15)</span></th>
              </tr>
              <tr>
                <th rowSpan={2} className={TH}>Đánh giá<br />ban đầu</th>
                <th rowSpan={2} className={TH}>Đánh giá<br />chi tiết</th>
                <th rowSpan={2} className={TH}>Chưa<br />bảo tồn</th>
                <th colSpan={4} className={TH}>Đang bảo tồn</th>
                <th rowSpan={2} className={TH}>Chưa khai<br />thác, SD</th>
                <th colSpan={3} className={TH}>Đang khai thác, sử dụng</th>
              </tr>
              <tr>
                <th className={TH}>(*) Phương<br />thức BT</th>
                <th className={TH}>(**) Hình<br />thức BT</th>
                <th className={TH}>Nơi BT,<br />lưu giữ</th>
                <th className={TH}>Đơn vị<br />thực hiện</th>
                <th className={TH}>(***)<br />Hình thức</th>
                <th className={TH}>Địa điểm</th>
                <th className={TH}>Đơn vị<br />thực hiện</th>
              </tr>
              <tr>
                <th className={TH}>3</th><th className={TH}>4</th><th className={TH}></th>
                <th className={TH}>7</th><th className={TH}>8</th>
                <th className={TH}>9</th><th className={TH}>10</th><th className={TH}>11</th>
                <th className={TH}>12</th><th className={TH}>13</th><th className={TH}>14</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map(({ id, roman, label, rows: sRows, start }) => (
                <Fragment key={id}>
                  <tr className="bg-gray-100">
                    <td className={`${TD} font-bold text-center`}>{roman}</td>
                    <td colSpan={16} className={`${TD} font-bold uppercase`}>{label}</td>
                  </tr>
                  {sRows.length === 0 ? (
                    <tr key={`empty-${id}`}>
                      <td colSpan={17} className={`${TD} text-center text-gray-400 italic py-2`}>
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  ) : sRows.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-blue-50 transition-colors">
                      <td className={`${TD} text-center text-gray-500`}>{start + idx + 1}</td>
                      <td className={TD}>{row.ten}</td>
                      <td className={`${TD} italic`}>{row.khoa_hoc}</td>
                      <td className={`${TD} text-center`}>{row.dang_mau}</td>
                      <td className={`${TD} text-center`}>{row.tu_lieu}</td>
                      <td className={`${TD} text-center`}>{row.dg_ban_dau}</td>
                      <td className={`${TD} text-center`}>{row.dg_chi_tiet}</td>
                      <td className={`${TD} text-center`}>{row.chua_bt}</td>
                      <td className={TD}>{row.pt_bt}</td>
                      <td className={TD}>{row.ht_bt}</td>
                      <td className={TD}>{row.noi_bt}</td>
                      <td className={TD}>{row.dv_bt}</td>
                      <td className={`${TD} text-center`}>{row.chua_kt}</td>
                      <td className={TD}>{row.ht_kt}</td>
                      <td className={TD}>{row.dia_diem}</td>
                      <td className={TD}>{row.dv_kt}</td>
                      <td className={TD}>{row.ghi_chu}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footnotes */}
        <div className="mt-4 space-y-1.5 text-[11px] sm:text-[12px] text-gray-600">
          <p>(*) Phương thức bảo tồn: Bảo tồn tại chỗ (NV); Bảo tồn chuyển chỗ (CV)</p>
          <p>(**) Hình thức bảo tồn: (1) Bảo vệ các sinh cảnh sống tự nhiên; (2) Lưu giữ in-vitro; (3) Lưu giữ trong kho lạnh sâu; (4) Lưu giữ giống trong trang trại, đồng ruộng, vườn hộ; (5) Lưu giữ cây đầu dòng trong nhà lưới; (6) Lưu giữ cây đầu dòng tại địa phương; (7) Lưu giữ cây đầu dòng tại Vườn thực vật; (8) Lưu giữ đông lạnh trong phòng thí nghiệm; (9) Lưu giữ đàn bố mẹ trong trang trại; (10) Lưu giữ đàn hạt nhân tại cơ sở bảo tồn; (11) Bảo tồn trong trang trại; (12) Duy trì rừng phòng hộ ven biển</p>
          <p>(***) Hình thức khai thác, sử dụng: (1) Đánh giá chất lượng, phục tráng giống; (2) Tuyển chọn cây đầu dòng, cây mẹ; (3) Xây dựng vườn cây đầu dòng; (4) Xây dựng mô hình sản xuất thử nghiệm; (5) Xây dựng mô hình trồng chuyên canh; (6) Mô hình kinh tế nông hộ; (7) Tuyển chọn giống bố mẹ; (8) Tuyển chọn đàn bố mẹ; (9) Xây dựng mô hình nuôi thử nghiệm; (10) Xây dựng mô hình chăn nuôi tập trung; (11) Mô hình chăn nuôi nông hộ; (12) Xây dựng mô hình chuyên canh; ...</p>
        </div>
      </div>
    </div>
  );
}
