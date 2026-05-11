"use client";

import { Form2Data, defaultForm2 } from "@/data/extendedTypes";

interface Props {
  nhom?: string;
  data: Partial<Form2Data>;
  onChange: (updated: Partial<Form2Data>) => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-bold text-gray-700 mt-5 mb-2 bg-gray-100 px-3 py-1.5 rounded text-xs uppercase tracking-wide">{children}</h3>
);

const TextRow = ({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600 pt-1.5">{label}</label>
    <div className="col-span-2">
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-gray-300 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent" />
    </div>
  </div>
);

const RadioRow = ({ label, name, options, value, onChange, otherValue, onOtherChange }: {
  label: string; name: string; options: string[]; value: string; onChange: (v: string) => void;
  otherValue?: string; onOtherChange?: (v: string) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600 pt-1">{label}</label>
    <div className="col-span-2 flex flex-wrap gap-x-5 gap-y-1.5 py-0.5">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-1.5 text-sm cursor-pointer whitespace-nowrap">
          <input type="radio" name={name} value={opt} checked={value === opt}
            onChange={() => onChange(opt)} className="accent-green-600 shrink-0" />
          {opt}
          {opt === 'Khác' && value === 'Khác' && onOtherChange && (
            <input type="text" value={otherValue ?? ''} onChange={(e) => onOtherChange(e.target.value)}
              placeholder="Ghi rõ..." onClick={(e) => e.stopPropagation()}
              className="ml-1 border-b border-gray-400 focus:border-green-600 outline-none px-1 py-0 text-sm bg-transparent w-28" />
          )}
        </label>
      ))}
    </div>
  </div>
);

const CheckboxRow = ({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) => {
  const selected = value ? value.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const toggle = (opt: string) => {
    const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt];
    onChange(next.join(', '));
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
      <label className="text-sm text-gray-600 pt-1">{label}</label>
      <div className="col-span-2 flex flex-wrap gap-x-5 gap-y-1.5 py-0.5">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-1.5 text-sm cursor-pointer whitespace-nowrap">
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)}
              className="accent-green-600 shrink-0" />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default function Form2Survey({ nhom, data, onChange }: Props) {
  const d = { ...defaultForm2(), ...data };
  const set = (f: keyof Form2Data, v: string) => onChange({ ...d, [f]: v });

  const isTTLN = !nhom || ['TT', 'LN'].includes(nhom);
  const isDL = nhom === 'DL';
  const isCN = nhom === 'CN';
  const isTS = nhom === 'TS';
  const isVS = nhom === 'VS';

  return (
    <div className="text-sm">
      <SectionTitle>I. Thông tin chung</SectionTitle>

      {/* 1. Mã nguồn gen */}
      <TextRow label="1. Mã nguồn gen thu thập" value={d.ma_thu_thap} onChange={(v) => set('ma_thu_thap', v)} />

      {/* 2. Tên nguồn gen */}
      <div className="py-2 border-b border-gray-100">
        <p className="text-sm text-gray-600 mb-2">2. Tên nguồn gen thu thập</p>
        <div className="pl-2 space-y-1">
          <p className="text-xs font-semibold text-gray-500 mb-1">- Tên Việt Nam</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 shrink-0">Tên bộ</span>
              <input type="text" value={d.ten_viet_bo} onChange={(e) => set('ten_viet_bo', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 shrink-0">Tên họ</span>
              <input type="text" value={d.ten_viet_ho} onChange={(e) => set('ten_viet_ho', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 shrink-0">Tên chi</span>
              <input type="text" value={d.ten_viet_chi} onChange={(e) => set('ten_viet_chi', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 shrink-0">Tên loài</span>
              <input type="text" value={d.ten_viet_loai} onChange={(e) => set('ten_viet_loai', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
          </div>
          <p className="text-xs font-semibold text-gray-500 mt-2 mb-1">- Tên khoa học</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 shrink-0">Tên bộ</span>
              <input type="text" value={d.ten_khoa_bo} onChange={(e) => set('ten_khoa_bo', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 shrink-0">Tên họ</span>
              <input type="text" value={d.ten_khoa_ho} onChange={(e) => set('ten_khoa_ho', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 shrink-0">Tên chi</span>
              <input type="text" value={d.ten_khoa_chi} onChange={(e) => set('ten_khoa_chi', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 shrink-0">Tên loài</span>
              <input type="text" value={d.ten_khoa_loai} onChange={(e) => set('ten_khoa_loai', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500 shrink-0">- Tên khác</span>
            <input type="text" value={d.ten_khac_2} onChange={(e) => set('ten_khac_2', e.target.value)}
              className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
          </div>
        </div>
      </div>

      {/* 3. Ngày thu thập */}
      <TextRow label="3. Ngày, tháng, năm thu thập" value={d.ngay_thu_thap} onChange={(v) => set('ngay_thu_thap', v)} />

      {/* 4. Nơi thu thập */}
      <div className="py-2 border-b border-gray-100">
        <p className="text-sm text-gray-600 mb-2">4. Nơi thu thập</p>
        <div className="pl-2 space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-20 shrink-0">Thôn/bản</span>
              <input type="text" value={d.thon_ban} onChange={(e) => set('thon_ban', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-32 shrink-0">Xã/phường/thị trấn</span>
              <input type="text" value={d.xa_phuong} onChange={(e) => set('xa_phuong', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-20 shrink-0">Huyện/thị/TP</span>
              <input type="text" value={d.huyen_thi_tp} onChange={(e) => set('huyen_thi_tp', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-32 shrink-0">Tỉnh</span>
              <input type="text" value={d.tinh} onChange={(e) => set('tinh', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 shrink-0">Tọa độ X</span>
              <input type="text" value={d.toa_do_x} onChange={(e) => set('toa_do_x', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 shrink-0">Y</span>
              <input type="text" value={d.toa_do_y} onChange={(e) => set('toa_do_y', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 shrink-0">Độ cao so với mặt biển (m)</span>
            <input type="text" value={d.do_cao} onChange={(e) => set('do_cao', e.target.value)}
              className="w-32 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
          </div>
        </div>
      </div>

      <TextRow label="5. Tên người/cơ quan gieo, trồng/cấp giống" value={d.ten_nguon_goc} onChange={(v) => set('ten_nguon_goc', v)} />
      <TextRow label="6. Tên người thu thập" value={d.ten_nguoi_thu_thap} onChange={(v) => set('ten_nguoi_thu_thap', v)} />
      <TextRow label="7. Cơ quan điều tra, thu thập" value={d.co_quan_dieu_tra} onChange={(v) => set('co_quan_dieu_tra', v)} />

      <SectionTitle>II. Thông tin mẫu thu thập</SectionTitle>
      <RadioRow
        label="8. Nguồn gốc mẫu thu thập (tự nhiên/đồi núi/đất hoang hoá/vườn hộ/...)"
        name="nguon_goc_mau"
        options={["Tự nhiên", "Đồi núi", "Đất hoang hoá", "Vườn hộ", "Khác"]}
        value={d.nguon_goc_mau} onChange={(v) => set('nguon_goc_mau', v)}
      />
      <RadioRow
        label="9. Dạng mẫu được thu thập (thân/cành/lá/hoa/quả/...)"
        name="dang_mau"
        options={["Thân", "Cành", "Lá", "Hoa", "Quả", "Khác"]}
        value={d.dang_mau} onChange={(v) => set('dang_mau', v)}
        otherValue={d.dang_mau_khac} onOtherChange={(v) => set('dang_mau_khac', v)}
      />
      <RadioRow
        label="10. Bản chất di truyền của mẫu thu thập (hoang dại/dòng lai/địa phương/nhập nội/...)"
        name="ban_chat_truyen"
        options={["Hoang dại", "Dòng lai", "Địa phương", "Nhập nội", "Khác"]}
        value={d.ban_chat_truyen} onChange={(v) => set('ban_chat_truyen', v)}
      />
      <RadioRow
        label="11. Mức độ thuần của mẫu: (thuần nhất/hỗn đồng/lẫn tạp, ...)"
        name="muc_do_thuan"
        options={["Thuần nhất", "Hỗn đồng", "Lẫn tạp", "Khác"]}
        value={d.muc_do_thuan} onChange={(v) => set('muc_do_thuan', v)}
      />
      <RadioRow
        label="12. Thời gian tồn tại của giống, loài tại nơi thu thập: (<2 năm/2-10 năm/>10 năm)"
        name="thoi_gian_ton_tai"
        options={["Dưới 2 năm", "Từ 2–10 năm", "Trên 10 năm"]}
        value={d.thoi_gian_ton_tai} onChange={(v) => set('thoi_gian_ton_tai', v)}
      />
      <RadioRow
        label="13. Mức độ phổ biến của giống tại nơi thu thập (nhiều (>30% hộ trồng)/vừa phải (15-30%)/ít (5-15%)/hiếm (<5%))"
        name="muc_do_pho_bien"
        options={["Nhiều (trên 30% hộ trồng)", "Vừa phải (từ 15–30%) hộ trồng", "Ít (từ 5–15%) hộ trồng", "Hiếm (dưới 5% hộ trồng)"]}
        value={d.muc_do_pho_bien} onChange={(v) => set('muc_do_pho_bien', v)}
      />
      <RadioRow
        label="14. Xu hướng phát triển của giống: (tăng/giữ nguyên/giảm/giảm nhanh/nguy cơ loại bỏ)"
        name="xu_huong_phat_trien"
        options={["Tăng", "Giữ nguyên", "Giảm", "Giảm nhanh", "Nguy cơ loại bỏ"]}
        value={d.xu_huong_phat_trien} onChange={(v) => set('xu_huong_phat_trien', v)}
      />

      {/* Section III — varies by species type */}
      {isTTLN && (
        <>
          <SectionTitle>III. Thông tin về điều kiện sinh trưởng của loài</SectionTitle>
          <RadioRow
            label="16. Địa hình (đất bằng/đồi dốc/thung lũng/ruộng, vườn/...)"
            name="dia_hinh"
            options={["Đất bằng", "Đồi dốc", "Thung lũng", "Ruộng, vườn", "Khác"]}
            value={d.dia_hinh} onChange={(v) => set('dia_hinh', v)}
          />
          <RadioRow
            label="17. Loại đất nơi cây sinh trưởng (cát/cát pha/thịt/thịt nặng/...)"
            name="loai_dat"
            options={["Cát", "Cát pha", "Thịt", "Thịt nặng", "Khác"]}
            value={d.loai_dat} onChange={(v) => set('loai_dat', v)}
            otherValue={d.loai_dat_khac} onOtherChange={(v) => set('loai_dat_khac', v)}
          />
          <RadioRow
            label="18. Màu đất nơi cây sinh trưởng (vàng/đỏ/nâu/xám/xám đen/...)"
            name="mau_dat"
            options={["Vàng", "Đỏ", "Nâu", "Xám", "Xám đen", "Khác"]}
            value={d.mau_dat} onChange={(v) => set('mau_dat', v)}
          />
          <RadioRow
            label="19. Thông tin về độ chua của đất (rất chua/chua/trung tính/kiềm/phèn mặn/...)"
            name="do_chua"
            options={["Rất chua", "Chua", "Trung tính", "Kiềm", "Phèn mặn"]}
            value={d.do_chua} onChange={(v) => set('do_chua', v)}
          />
          <RadioRow
            label="20. Vật liệu nhân giống (thân/củ/hạt/mô/...)"
            name="vat_lieu_nhan_giong"
            options={["Thân", "Củ", "Hạt", "Mô", "Khác"]}
            value={d.vat_lieu_nhan_giong} onChange={(v) => set('vat_lieu_nhan_giong', v)}
            otherValue={d.vat_lieu_nhan_giong_khac} onOtherChange={(v) => set('vat_lieu_nhan_giong_khac', v)}
          />
          <RadioRow
            label="21. Nguồn gốc giống (tự để giống/mua ở CS sản xuất/địa phương/nhập nội/...)"
            name="nguon_giong_ruong"
            options={["Tự để giống", "Mua ở cơ sở sản xuất", "Địa phương", "Nhập nội", "Khác"]}
            value={d.nguon_giong_ruong} onChange={(v) => set('nguon_giong_ruong', v)}
          />
          <RadioRow
            label="22. Phương thức canh tác (đơn canh/xen canh/gối vụ/hỗn giống/...)"
            name="phuong_thuc_canh_tac"
            options={["Đơn canh", "Xen canh", "Gối vụ", "Hỗn giống", "Khác"]}
            value={d.phuong_thuc_canh_tac} onChange={(v) => set('phuong_thuc_canh_tac', v)}
          />
          <RadioRow
            label="23. Phương pháp canh tác (gieo thẳng/trồng cây con/giâm cành/cành chiết/...)"
            name="phuong_phap_gieo_trong"
            options={["Gieo thẳng", "Trồng cây con", "Giâm cành", "Cành chiết", "Khác"]}
            value={d.phuong_phap_gieo_trong} onChange={(v) => set('phuong_phap_gieo_trong', v)}
          />
          <CheckboxRow
            label="24. Thời vụ trồng (xuân/thu/quanh năm/...)"
            options={["Xuân", "Thu", "Quanh năm", "Khác"]}
            value={d.thoi_vu_trong} onChange={(v) => set('thoi_vu_trong', v)}
          />
          <RadioRow
            label="25. Thời gian sinh trưởng hoặc thành thục (Dưới 5 năm/5–10 năm/10–20 năm/trên 20 năm)"
            name="thoi_gian_sinh_truong"
            options={["Dưới 5 năm", "5–10 năm", "10–20 năm", "Trên 20 năm"]}
            value={d.thoi_gian_sinh_truong} onChange={(v) => set('thoi_gian_sinh_truong', v)}
          />
          <RadioRow
            label="26. Sử dụng phân bón (không sử dụng/phân hóa học/phân hữu cơ/hỗn hợp/...)"
            name="phan_bon"
            options={["Không sử dụng", "Phân hoá học", "Phân hữu cơ", "Hỗn hợp", "Khác"]}
            value={d.phan_bon} onChange={(v) => set('phan_bon', v)}
          />
          <RadioRow
            label="27. Biện pháp phòng trừ sâu bệnh (không áp dụng/thuốc dân gian/thuốc BVTV/...)"
            name="phong_tru_sau_benh"
            options={["Không áp dụng", "Thuốc dân gian", "Thuốc BVTV", "Khác"]}
            value={d.phong_tru_sau_benh} onChange={(v) => set('phong_tru_sau_benh', v)}
          />
        </>
      )}

      {isDL && (
        <>
          <SectionTitle>III. Thông tin về điều kiện sinh trưởng của loài</SectionTitle>
          <RadioRow
            label="16. Nguồn gốc giống (tự nhiên/tự nhân giống/mua/nhập nội/...)"
            name="nguon_giong_ruong"
            options={["Tự nhiên", "Tự nhân giống", "Mua", "Nhập nội", "Khác"]}
            value={d.nguon_giong_ruong} onChange={(v) => set('nguon_giong_ruong', v)}
          />
          <RadioRow
            label="17. Loại hình nuôi trồng (tự nhiên/ruộng/vườn/nhà mái che/phòng TN/...)"
            name="dl_loai_hinh_nuoi_trong"
            options={["Tự nhiên", "Ruộng", "Vườn", "Nhà mái che", "Phòng TN", "Khác"]}
            value={d.dl_loai_hinh_nuoi_trong} onChange={(v) => set('dl_loai_hinh_nuoi_trong', v)}
          />
          <RadioRow
            label="18. Kỹ thuật nuôi trồng (tự nhiên/truyền thống/công nghệ chuyển giao/...)"
            name="dl_ky_thuat_nuoi_trong"
            options={["Tự nhiên", "Truyền thống", "Công nghệ chuyển giao", "Khác"]}
            value={d.dl_ky_thuat_nuoi_trong} onChange={(v) => set('dl_ky_thuat_nuoi_trong', v)}
          />
          <CheckboxRow
            label="19. Thời vụ trồng (xuân/hạ/thu/đông/quanh năm/...)"
            options={["Xuân", "Hạ", "Thu", "Đông", "Quanh năm", "Khác"]}
            value={d.thoi_vu_trong} onChange={(v) => set('thoi_vu_trong', v)}
          />
          <CheckboxRow
            label="20. Thời vụ thu hoạch (xuân/hạ/thu/đông/quanh năm/...)"
            options={["Xuân", "Hạ", "Thu", "Đông", "Quanh năm", "Khác"]}
            value={d.dl_thoi_vu_thu_hoach} onChange={(v) => set('dl_thoi_vu_thu_hoach', v)}
          />
          <RadioRow
            label="21. Vật liệu nhân giống (hạt/thân/củ/hom/bào tử/...)"
            name="vat_lieu_nhan_giong"
            options={["Hạt", "Thân", "Củ", "Hom", "Bào tử", "Khác"]}
            value={d.vat_lieu_nhan_giong} onChange={(v) => set('vat_lieu_nhan_giong', v)}
            otherValue={d.vat_lieu_nhan_giong_khac} onOtherChange={(v) => set('vat_lieu_nhan_giong_khac', v)}
          />
          <TextRow
            label="22. Thời gian sinh trưởng (từ trồng đến thu hoạch)"
            value={d.thoi_gian_sinh_truong} onChange={(v) => set('thoi_gian_sinh_truong', v)}
          />
          <RadioRow
            label="23. Sử dụng phân bón/dinh dưỡng bổ sung (không sử dụng/phân hóa học/phân hữu cơ/hỗn hợp/...)"
            name="phan_bon"
            options={["Không sử dụng", "Phân hoá học", "Phân hữu cơ", "Hỗn hợp", "Khác"]}
            value={d.phan_bon} onChange={(v) => set('phan_bon', v)}
          />
          <RadioRow
            label="24. Biện pháp phòng trừ sâu bệnh (không áp dụng/thuốc sinh học/thuốc hoá học/kết hợp/...)"
            name="phong_tru_sau_benh"
            options={["Không áp dụng", "Thuốc sinh học", "Thuốc hoá học", "Chất kích thích ST", "Kết hợp", "Khác"]}
            value={d.phong_tru_sau_benh} onChange={(v) => set('phong_tru_sau_benh', v)}
          />
        </>
      )}

      {isCN && (
        <>
          <SectionTitle>III. Thông tin về điều kiện sinh trưởng của loài</SectionTitle>
          <RadioRow
            label="16. Nguồn gốc giống (tự nhiên/tự nhân giống/mua/nhập nội/...)"
            name="cn_nguon_goc_giong"
            options={["Tự nhiên", "Tự nhân giống", "Mua", "Nhập nội", "Khác"]}
            value={d.cn_nguon_goc_giong} onChange={(v) => set('cn_nguon_goc_giong', v)}
          />
          <RadioRow
            label="17. Loại hình nuôi/trồng (CN hộ/trang trại/CNC/tự nhiên/...)"
            name="cn_hinh_thuc_chan_nuoi"
            options={["CN hộ", "Trang trại", "CNC", "Tự nhiên", "Khác"]}
            value={d.cn_hinh_thuc_chan_nuoi} onChange={(v) => set('cn_hinh_thuc_chan_nuoi', v)}
          />
          <RadioRow
            label="18. Thức ăn (tự nhiên/tự cung cấp/công nghiệp/...)"
            name="cn_thuc_an"
            options={["Tự nhiên", "Tự cung cấp", "Công nghiệp", "Hỗn hợp", "Khác"]}
            value={d.cn_thuc_an} onChange={(v) => set('cn_thuc_an', v)}
          />
          <RadioRow
            label="19. Nguồn gốc giống (tự để giống/mua từ CSSX/trao đổi tại địa phương/...)"
            name="nguon_giong_ruong"
            options={["Tự để giống", "Mua từ CSSX", "Trao đổi tại địa phương", "Nhập nội", "Khác"]}
            value={d.nguon_giong_ruong} onChange={(v) => set('nguon_giong_ruong', v)}
          />
          <RadioRow
            label="20. Phương thức nuôi (công nghiệp/bán chăn thả/chăn thả/...)"
            name="cn_phuong_thuc_nuoi"
            options={["Công nghiệp", "Bán chăn thả", "Chăn thả", "Khác"]}
            value={d.cn_phuong_thuc_nuoi} onChange={(v) => set('cn_phuong_thuc_nuoi', v)}
          />
          <TextRow
            label="21. Thời gian sinh trưởng hoặc tuổi thành thục"
            value={d.thoi_gian_sinh_truong} onChange={(v) => set('thoi_gian_sinh_truong', v)}
          />
          <RadioRow
            label="22. Biện pháp phòng trừ sâu bệnh (không áp dụng/thuốc dân gian/thuốc BVTV/...)"
            name="cn_phong_dich"
            options={["Không áp dụng", "Thuốc dân gian", "Thuốc BVTV", "Khác"]}
            value={d.cn_phong_dich} onChange={(v) => set('cn_phong_dich', v)}
          />
        </>
      )}

      {isTS && (
        <>
          <SectionTitle>III. Thông tin về điều kiện sinh trưởng của loài</SectionTitle>
          <RadioRow
            label="16. Nguồn gốc giống (tự nhiên/tự nhân giống/mua/nhập nội/...)"
            name="ts_nguon_goc_giong"
            options={["Tự nhiên", "Tự nhân giống", "Mua", "Nhập nội", "Khác"]}
            value={d.ts_nguon_goc_giong} onChange={(v) => set('ts_nguon_goc_giong', v)}
          />
          <RadioRow
            label="17. Loại hình nuôi/trồng (CN hộ/trang trại/CNC/tự nhiên/...)"
            name="ts_loai_hinh_nuoi"
            options={["CN hộ", "Trang trại", "CNC", "Tự nhiên", "Khác"]}
            value={d.ts_loai_hinh_nuoi} onChange={(v) => set('ts_loai_hinh_nuoi', v)}
          />
          <RadioRow
            label="18. Thức ăn (tự nhiên/tự cung cấp/công nghiệp/...)"
            name="ts_thuc_an"
            options={["Tự nhiên", "Tự cung cấp", "Công nghiệp", "Hỗn hợp", "Khác"]}
            value={d.ts_thuc_an} onChange={(v) => set('ts_thuc_an', v)}
          />
          <RadioRow
            label="19. Nguồn gốc giống (tự để giống/mua từ CSSX/trao đổi tại địa phương/...)"
            name="nguon_giong_ruong"
            options={["Tự để giống", "Mua từ CSSX", "Trao đổi tại địa phương", "Nhập nội", "Khác"]}
            value={d.nguon_giong_ruong} onChange={(v) => set('nguon_giong_ruong', v)}
          />
          <RadioRow
            label="20. Phương thức nuôi (công nghiệp/bán chăn thả/chăn thả/...)"
            name="ts_phuong_thuc_nuoi"
            options={["Công nghiệp", "Bán chăn thả", "Chăn thả", "Khác"]}
            value={d.ts_phuong_thuc_nuoi} onChange={(v) => set('ts_phuong_thuc_nuoi', v)}
          />
          <TextRow
            label="21. Thời gian sinh trưởng hoặc tuổi thành thục"
            value={d.thoi_gian_sinh_truong} onChange={(v) => set('thoi_gian_sinh_truong', v)}
          />
          <RadioRow
            label="22. Biện pháp phòng trừ sâu bệnh (không áp dụng/thuốc dân gian/thuốc BVTV/...)"
            name="phong_tru_sau_benh"
            options={["Không áp dụng", "Thuốc dân gian", "Thuốc BVTV", "Khác"]}
            value={d.phong_tru_sau_benh} onChange={(v) => set('phong_tru_sau_benh', v)}
          />
        </>
      )}

      {isVS && (
        <>
          <SectionTitle>III. Thông tin về điều kiện sinh trưởng của loài</SectionTitle>
          <RadioRow
            label="12. Nguồn gốc giống/chủng VSV (tự nhiên/tự nhân giống/mua/nhập nội/...)"
            name="nguon_giong_ruong"
            options={["Tự nhiên", "Tự nhân giống", "Mua", "Nhập nội", "Khác"]}
            value={d.nguon_giong_ruong} onChange={(v) => set('nguon_giong_ruong', v)}
          />
          <RadioRow
            label="13. Loại hình sản xuất (tự nhiên/ruộng/vườn/nhà mái che/phòng TN/...)"
            name="dl_loai_hinh_nuoi_trong"
            options={["Tự nhiên", "Ruộng", "Vườn", "Nhà mái che", "Phòng TN", "Khác"]}
            value={d.dl_loai_hinh_nuoi_trong} onChange={(v) => set('dl_loai_hinh_nuoi_trong', v)}
          />
          <RadioRow
            label="14. Kỹ thuật nuôi trồng (tự nhiên/truyền thống/công nghệ chuyển giao/...)"
            name="dl_ky_thuat_nuoi_trong"
            options={["Tự nhiên", "Truyền thống", "Công nghệ chuyển giao", "Khác"]}
            value={d.dl_ky_thuat_nuoi_trong} onChange={(v) => set('dl_ky_thuat_nuoi_trong', v)}
          />
          <CheckboxRow
            label="15. Thời vụ trồng (xuân/hạ/thu/đông/quanh năm/...)"
            options={["Xuân", "Hạ", "Thu", "Đông", "Quanh năm", "Khác"]}
            value={d.thoi_vu_trong} onChange={(v) => set('thoi_vu_trong', v)}
          />
          <CheckboxRow
            label="16. Thời vụ thu hoạch (xuân/hạ/thu/đông/quanh năm/...)"
            options={["Xuân", "Hạ", "Thu", "Đông", "Quanh năm", "Khác"]}
            value={d.dl_thoi_vu_thu_hoach} onChange={(v) => set('dl_thoi_vu_thu_hoach', v)}
          />
          <RadioRow
            label="17. Vật liệu nhân giống (sợi nấm/bào tử/tế bào/khuẩn lạc/giọt dịch/...)"
            name="vat_lieu_nhan_giong"
            options={["Sợi nấm", "Bào tử", "Tế bào", "Khuẩn lạc", "Giọt dịch", "Khác"]}
            value={d.vat_lieu_nhan_giong} onChange={(v) => set('vat_lieu_nhan_giong', v)}
            otherValue={d.vat_lieu_nhan_giong_khac} onOtherChange={(v) => set('vat_lieu_nhan_giong_khac', v)}
          />
          <TextRow
            label="18. Môi trường giá thể dinh dưỡng (rắn/lỏng/cơ chất thô/...)"
            value={d.vs_moi_truong_nuoi_cay} onChange={(v) => set('vs_moi_truong_nuoi_cay', v)}
          />
        </>
      )}

      <SectionTitle>IV. Thông tin sử dụng, bảo quản và chế biến</SectionTitle>
      {isDL ? (
        <>
          <TextRow label="25. Mục đích sử dụng chính (thực phẩm/dược liệu/...)" value={d.muc_dich_su_dung} onChange={(v) => set('muc_dich_su_dung', v)} />
          <TextRow label="26. Bộ phận được thu hoạch, sử dụng chính (rễ/thân/lá/hoa/quả/toàn bộ/...)" value={d.phan_cay_su_dung} onChange={(v) => set('phan_cay_su_dung', v)} />
          <TextRow label="27. Phương pháp thu hoạch sản phẩm" value={d.thu_hoach} onChange={(v) => set('thu_hoach', v)} />
          <TextRow label="28. Phương pháp bảo quản sản phẩm" value={d.phuong_phap_bao_quan_sp} onChange={(v) => set('phuong_phap_bao_quan_sp', v)} />
          <TextRow label="29. Cách chế biến" value={d.cach_che_bien} onChange={(v) => set('cach_che_bien', v)} />
          <TextRow label="30. Phương pháp để giống" value={d.phuong_phap_de_giong} onChange={(v) => set('phuong_phap_de_giong', v)} />
          <TextRow label="31. Kinh nghiệm, tiêu chí chọn giống" value={d.kinh_nghiem_chon_giong} onChange={(v) => set('kinh_nghiem_chon_giong', v)} />
        </>
      ) : (isCN || isTS) ? (
        <>
          <TextRow label="23. Bộ phận được thu hoạch, sử dụng chính" value={d.phan_cay_su_dung} onChange={(v) => set('phan_cay_su_dung', v)} />
          <TextRow label="24. Mục đích sử dụng chính (thực phẩm/sinh sản/sức kéo/...)" value={d.muc_dich_su_dung} onChange={(v) => set('muc_dich_su_dung', v)} />
          <TextRow label="25. Phương pháp thu hoạch sản phẩm" value={d.thu_hoach} onChange={(v) => set('thu_hoach', v)} />
          <TextRow label="26. Phương pháp bảo quản sản phẩm" value={d.phuong_phap_bao_quan_sp} onChange={(v) => set('phuong_phap_bao_quan_sp', v)} />
          <TextRow label="27. Cách chế biến" value={d.cach_che_bien} onChange={(v) => set('cach_che_bien', v)} />
          <TextRow label="28. Phương pháp để giống" value={d.phuong_phap_de_giong} onChange={(v) => set('phuong_phap_de_giong', v)} />
          <TextRow label="29. Kinh nghiệm, tiêu chí chọn giống" value={d.kinh_nghiem_chon_giong} onChange={(v) => set('kinh_nghiem_chon_giong', v)} />
        </>
      ) : isVS ? (
        <>
          <TextRow label="19. Mục đích sử dụng chính (xử lý môi trường/phân giải hữu cơ/đối kháng/lên men/...)" value={d.muc_dich_su_dung} onChange={(v) => set('muc_dich_su_dung', v)} />
          <TextRow label="20. Bộ phận được thu hoạch, sử dụng chính (bào tử/sợi nấm/tế bào/khuẩn lạc/giọt dịch/...)" value={d.phan_cay_su_dung} onChange={(v) => set('phan_cay_su_dung', v)} />
          <TextRow label="21. Khai thác sản phẩm" value={d.thu_hoach} onChange={(v) => set('thu_hoach', v)} />
          <TextRow label="22. Phương pháp bảo quản sản phẩm" value={d.phuong_phap_bao_quan_sp} onChange={(v) => set('phuong_phap_bao_quan_sp', v)} />
          <TextRow label="23. Phương pháp sản xuất, chế biến" value={d.cach_che_bien} onChange={(v) => set('cach_che_bien', v)} />
          <TextRow label="24. Phương pháp duy trì, bảo quản" value={d.phuong_phap_de_giong} onChange={(v) => set('phuong_phap_de_giong', v)} />
          <TextRow label="25. Kinh nghiệm, tiêu chí chọn chủng/giống" value={d.kinh_nghiem_chon_giong} onChange={(v) => set('kinh_nghiem_chon_giong', v)} />
        </>
      ) : (
        <>
          <TextRow label="28. Bộ phận của cây được thu hoạch, sử dụng chính" value={d.phan_cay_su_dung} onChange={(v) => set('phan_cay_su_dung', v)} />
          <TextRow label="29. Mục đích sử dụng chính" value={d.muc_dich_su_dung} onChange={(v) => set('muc_dich_su_dung', v)} />
          <TextRow label="30. Phương pháp thu hoạch sản phẩm" value={d.thu_hoach} onChange={(v) => set('thu_hoach', v)} />
          <TextRow label="31. Phương pháp bảo quản sản phẩm" value={d.phuong_phap_bao_quan_sp} onChange={(v) => set('phuong_phap_bao_quan_sp', v)} />
          <TextRow label="32. Cách chế biến" value={d.cach_che_bien} onChange={(v) => set('cach_che_bien', v)} />
          <TextRow label="33. Phương pháp để giống" value={d.phuong_phap_de_giong} onChange={(v) => set('phuong_phap_de_giong', v)} />
          <TextRow label="34. Kinh nghiệm, tiêu chí chọn giống" value={d.kinh_nghiem_chon_giong} onChange={(v) => set('kinh_nghiem_chon_giong', v)} />
        </>
      )}

      <SectionTitle>V. Các đặc tính nổi bật của nguồn gen</SectionTitle>
      <div className="py-2">
        <p className="text-xs text-gray-500 mb-2">(Năng suất, chất lượng, đặc tính kháng sâu bệnh, đặc tính chống chịu sinh thái bất thuận)</p>
        <textarea value={d.dac_tinh_noi_bat} onChange={(e) => set('dac_tinh_noi_bat', e.target.value)}
          rows={4} className="w-full border border-gray-200 rounded p-1.5 text-sm resize-none focus:outline-none focus:border-green-500 bg-gray-50" />
      </div>
    </div>
  );
}
