"use client";

import { Form2Data, defaultForm2 } from "@/data/extendedTypes";

interface Props {
  data: Partial<Form2Data>;
  onChange: (updated: Partial<Form2Data>) => void;
}

const Row = ({ label, value, onChange, required, type = "text", rows }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; type?: string; rows?: number;
}) => (
  <div className="grid grid-cols-3 gap-3 items-start py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600 pt-1.5">
      {required && <span className="text-red-500 mr-0.5">*</span>}{label}
    </label>
    <div className="col-span-2">
      {rows ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded p-1.5 text-sm resize-none focus:outline-none focus:border-green-500 bg-gray-50" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full border-b border-gray-300 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent" />
      )}
    </div>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-bold text-gray-700 mt-5 mb-2 bg-gray-100 px-3 py-1.5 rounded text-xs uppercase tracking-wide">{children}</h3>
);

export default function Form2Survey({ data, onChange }: Props) {
  const d = { ...defaultForm2(), ...data };
  const set = (f: keyof Form2Data, v: string) => onChange({ ...d, [f]: v });

  return (
    <div className="text-sm">
      <SectionTitle>I. Thông tin chung</SectionTitle>
      <Row label="Mã nguồn gen thu thập" value={d.ma_thu_thap} onChange={(v) => set('ma_thu_thap', v)} />
      <Row label="Ngày, tháng, năm thu thập" value={d.ngay_thu_thap} onChange={(v) => set('ngay_thu_thap', v)} type="date" />
      <Row label="Mùa thu thập" value={d.mua_thu_thap} onChange={(v) => set('mua_thu_thap', v)} />
      <div className="grid grid-cols-3 gap-3 items-start py-2 border-b border-gray-100">
        <label className="text-sm text-gray-600">Tọa độ</label>
        <div className="col-span-2 flex gap-3">
          <div className="flex items-center gap-1 flex-1">
            <span className="text-xs text-gray-400">X:</span>
            <input type="text" value={d.toa_do_x} onChange={(e) => set('toa_do_x', e.target.value)}
              className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent" />
          </div>
          <div className="flex items-center gap-1 flex-1">
            <span className="text-xs text-gray-400">Y:</span>
            <input type="text" value={d.toa_do_y} onChange={(e) => set('toa_do_y', e.target.value)}
              className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent" />
          </div>
        </div>
      </div>
      <Row label="Độ cao so với mặt biển (m)" value={d.do_cao} onChange={(v) => set('do_cao', v)} />
      <Row label="Tên nguồn gốc quan giao, trồng/cấp giống" value={d.ten_nguon_goc} onChange={(v) => set('ten_nguon_goc', v)} />
      <Row label="Tên người thu thập" value={d.ten_nguoi_thu_thap} onChange={(v) => set('ten_nguoi_thu_thap', v)} />
      <Row label="Cơ quan điều tra, thu thập" value={d.co_quan_dieu_tra} onChange={(v) => set('co_quan_dieu_tra', v)} />

      <SectionTitle>II. Thông tin mẫu thu thập</SectionTitle>
      <Row label="Nguồn gốc mẫu thu thập" value={d.nguon_goc_mau} onChange={(v) => set('nguon_goc_mau', v)} />
      <Row label="Dạng mẫu thu thập" value={d.dang_mau} onChange={(v) => set('dang_mau', v)} />
      <Row label="Bản chất để truyền của mẫu" value={d.ban_chat_truyen} onChange={(v) => set('ban_chat_truyen', v)} />
      <Row label="Mức độ thuần của mẫu" value={d.muc_do_thuan} onChange={(v) => set('muc_do_thuan', v)} />
      <Row label="Thời gian tồn tại của giống" value={d.thoi_gian_ton_tai} onChange={(v) => set('thoi_gian_ton_tai', v)} />
      <Row label="Mức độ phổ biến của giống" value={d.muc_do_pho_bien} onChange={(v) => set('muc_do_pho_bien', v)} />
      <Row label="Xu hướng phát triển của giống" value={d.xu_huong_phat_trien} onChange={(v) => set('xu_huong_phat_trien', v)} />

      <SectionTitle>III. Thông tin về điều kiện sinh trưởng của loài</SectionTitle>
      <Row label="Địa hình" value={d.dia_hinh} onChange={(v) => set('dia_hinh', v)} />
      <Row label="Loại đất cây sinh trưởng" value={d.loai_dat} onChange={(v) => set('loai_dat', v)} />
      <Row label="Màu đất nơi cây sinh trưởng" value={d.mau_dat} onChange={(v) => set('mau_dat', v)} />
      <Row label="Độ chua của đất" value={d.do_chua} onChange={(v) => set('do_chua', v)} />
      <Row label="Màu lá mạnh" value={d.mau_la_manh} onChange={(v) => set('mau_la_manh', v)} />
      <Row label="Phương pháp canh tác" value={d.phuong_thuc_canh_tac} onChange={(v) => set('phuong_thuc_canh_tac', v)} />
      <Row label="Thu hoạch" value={d.thu_hoach} onChange={(v) => set('thu_hoach', v)} />
      <Row label="Thời gian sinh trưởng" value={d.thoi_gian_sinh_truong} onChange={(v) => set('thoi_gian_sinh_truong', v)} />
      <Row label="Sử dụng phân bón" value={d.phan_bon} onChange={(v) => set('phan_bon', v)} />
      <Row label="Phòng trừ sâu bệnh" value={d.phong_tru_sau_benh} onChange={(v) => set('phong_tru_sau_benh', v)} />

      <SectionTitle>IV. Thông tin sử dụng, bảo quản và chế biến</SectionTitle>
      <Row label="Phần của cây dùng làm vật liệu" value={d.phan_cay_su_dung} onChange={(v) => set('phan_cay_su_dung', v)} />
      <Row label="Mục đích sử dụng chính" value={d.muc_dich_su_dung} onChange={(v) => set('muc_dich_su_dung', v)} />
      <Row label="Phương pháp bảo quản vật liệu" value={d.phuong_phap_bao_quan} onChange={(v) => set('phuong_phap_bao_quan', v)} />
      <Row label="Phương pháp bảo quản sản phẩm" value={d.phuong_phap_bao_quan_sp} onChange={(v) => set('phuong_phap_bao_quan_sp', v)} />
      <Row label="Cách chế biến" value={d.cach_che_bien} onChange={(v) => set('cach_che_bien', v)} />
      <Row label="Phương pháp để giống" value={d.phuong_phap_de_giong} onChange={(v) => set('phuong_phap_de_giong', v)} />

      <SectionTitle>V. Các đặc tính nổi bật của nguồn gen</SectionTitle>
      <Row label="Mô tả đặc tính nổi bật" value={d.dac_tinh_noi_bat} onChange={(v) => set('dac_tinh_noi_bat', v)} rows={4} />
    </div>
  );
}
