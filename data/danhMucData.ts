export interface PhuongThucBaoTon {
  id: string;
  ten: string;
  ma: string;
  trang_thai: 'kich_hoat' | 'an';
  created_at: string;
}

export interface HinhThucBaoTon {
  id: number;
  ten: string;
  ma: number;
  phuong_thuc_id: string; // id of PhuongThucBaoTon
  nhom: string[];         // nhom IDs: TT, LN, DL, CN, TS, VS
  trang_thai: 'kich_hoat' | 'an';
  created_at: string;
}

export interface HinhThucKhaiThac {
  id: number;
  ten: string;
  ma: number;
  nhom: string[];
  trang_thai: 'kich_hoat' | 'an';
  created_at: string;
}

export const PHUONG_THUC_BAO_TON: PhuongThucBaoTon[] = [
  { id: 'tai-cho', ten: 'Bảo tồn tại chỗ',     ma: 'NV', trang_thai: 'kich_hoat', created_at: '2024-10-18T08:30:00' },
  { id: 'chuyen-cho', ten: 'Bảo tồn chuyển chỗ', ma: 'CV', trang_thai: 'kich_hoat', created_at: '2024-10-18T08:01:00' },
];

export const HINH_THUC_BAO_TON: HinhThucBaoTon[] = [
  { id: 1,  ten: 'Bảo vệ các sinh cảnh sống tự nhiên của loài',               ma: 1,  phuong_thuc_id: 'tai-cho',    nhom: ['TT','LN','DL','CN','TS','VS'], trang_thai: 'kich_hoat', created_at: '2024-06-05T14:03:00' },
  { id: 2,  ten: 'Lưu giữ in-vitro',                                           ma: 2,  phuong_thuc_id: 'chuyen-cho', nhom: ['TT','LN','DL','VS'],           trang_thai: 'kich_hoat', created_at: '2024-06-05T14:03:00' },
  { id: 3,  ten: 'Lưu giữ trong kho lạnh sâu',                                 ma: 3,  phuong_thuc_id: 'chuyen-cho', nhom: ['TT','LN','DL'],                trang_thai: 'kich_hoat', created_at: '2024-06-05T14:03:00' },
  { id: 4,  ten: 'Lưu giữ giống trong trang trại, đồng ruộng, vườn hộ',        ma: 4,  phuong_thuc_id: 'tai-cho',    nhom: ['TT','LN','DL','VS'],           trang_thai: 'kich_hoat', created_at: '2024-06-05T14:03:00' },
  { id: 5,  ten: 'Lưu giữ cây đầu dòng trong nhà lưới',                        ma: 5,  phuong_thuc_id: 'chuyen-cho', nhom: ['TT','LN','DL'],                trang_thai: 'kich_hoat', created_at: '2024-06-05T14:04:00' },
  { id: 6,  ten: 'Lưu giữ cây đầu dòng tại địa phương',                        ma: 6,  phuong_thuc_id: 'tai-cho',    nhom: ['TT','LN','DL'],                trang_thai: 'kich_hoat', created_at: '2024-06-05T14:05:00' },
  { id: 7,  ten: 'Lưu giữ cây đầu dòng tại Vườn thực vật',                     ma: 7,  phuong_thuc_id: 'chuyen-cho', nhom: ['TT','LN','DL'],                trang_thai: 'kich_hoat', created_at: '2024-06-05T14:05:00' },
  { id: 8,  ten: 'Lưu giữ đông lạnh trong phòng thí nghiệm',                   ma: 8,  phuong_thuc_id: 'chuyen-cho', nhom: ['CN','TS'],                     trang_thai: 'kich_hoat', created_at: '2024-10-10T10:29:00' },
  { id: 9,  ten: 'Lưu giữ đàn bố mẹ trong trang trại, cơ sở sản xuất giống',  ma: 9,  phuong_thuc_id: 'chuyen-cho', nhom: ['CN','TS','VS'],                trang_thai: 'kich_hoat', created_at: '2024-10-10T10:30:00' },
  { id: 10, ten: 'Lưu giữ đàn hạt nhân, đàn bố mẹ tại cơ sở bảo tồn',         ma: 10, phuong_thuc_id: 'chuyen-cho', nhom: ['CN','TS'],                     trang_thai: 'kich_hoat', created_at: '2024-10-10T10:30:00' },
  { id: 11, ten: 'Bảo tồn trong trang trại',                                    ma: 11, phuong_thuc_id: 'tai-cho',    nhom: ['CN'],                          trang_thai: 'kich_hoat', created_at: '2024-10-18T09:18:00' },
  { id: 12, ten: 'Duy trì rừng phòng hộ ven biển',                              ma: 12, phuong_thuc_id: 'tai-cho',    nhom: ['LN'],                          trang_thai: 'kich_hoat', created_at: '2024-11-19T15:20:00' },
];

export const HINH_THUC_KHAI_THAC: HinhThucKhaiThac[] = [
  { id: 1,  ten: 'Đánh giá chất lượng, phục tráng giống',                       ma: 1,  nhom: ['TT','LN','DL','CN','TS'],    trang_thai: 'kich_hoat', created_at: '2026-05-05T22:21:00' },
  { id: 2,  ten: 'Tuyển chọn cây đầu dòng, cây mẹ',                             ma: 2,  nhom: ['TT','LN','DL'],              trang_thai: 'kich_hoat', created_at: '2024-10-18T15:38:00' },
  { id: 3,  ten: 'Xây dựng vườn cây đầu dòng',                                  ma: 3,  nhom: ['TT','LN','DL'],              trang_thai: 'kich_hoat', created_at: '2024-10-14T09:08:00' },
  { id: 4,  ten: 'Xây dựng mô hình sản xuất thử nghiệm',                        ma: 4,  nhom: ['TT','LN','DL'],              trang_thai: 'kich_hoat', created_at: '2024-06-05T17:35:00' },
  { id: 5,  ten: 'Xây dựng mô hình trồng chuyên canh',                          ma: 5,  nhom: ['TT','LN','DL'],              trang_thai: 'kich_hoat', created_at: '2024-10-16T10:22:00' },
  { id: 6,  ten: 'Mô hình kinh tế nông hộ',                                     ma: 6,  nhom: ['TT','LN','DL','TS'],         trang_thai: 'kich_hoat', created_at: '2024-10-18T15:39:00' },
  { id: 7,  ten: 'Tuyển chọn giống bố mẹ',                                      ma: 7,  nhom: ['CN','TS'],                   trang_thai: 'kich_hoat', created_at: '2024-10-10T10:20:00' },
  { id: 8,  ten: 'Tuyển chọn đàn đàn bố mẹ',                                    ma: 8,  nhom: ['CN','TS'],                   trang_thai: 'kich_hoat', created_at: '2024-10-10T10:20:00' },
  { id: 9,  ten: 'Xây dựng mô hình nuôi thử nghiệm, sản xuất thử nghiệm',       ma: 9,  nhom: ['CN','TS'],                   trang_thai: 'kich_hoat', created_at: '2024-10-10T10:21:00' },
  { id: 10, ten: 'Xây dựng mô hình chăn nuôi tập trung',                        ma: 10, nhom: ['CN','TS'],                   trang_thai: 'kich_hoat', created_at: '2024-10-10T10:21:00' },
  { id: 11, ten: 'Mô hình chăn nuôi nông hộ',                                   ma: 11, nhom: ['CN'],                        trang_thai: 'kich_hoat', created_at: '2024-10-10T10:21:00' },
  { id: 12, ten: 'Xây dựng mô hình chuyên canh',                                ma: 12, nhom: ['TS','VS'],                   trang_thai: 'kich_hoat', created_at: '2024-10-10T10:27:00' },
  { id: 13, ten: 'Phân lập và tuyển chọn các chủng gốc VSV, nấm',               ma: 13, nhom: ['VS'],                        trang_thai: 'kich_hoat', created_at: '2024-10-10T10:34:00' },
  { id: 14, ten: 'Xây dựng mô hình nuôi trồng thử nghiệm, sản xuất thử nghiệm', ma: 14, nhom: ['VS'],                       trang_thai: 'kich_hoat', created_at: '2024-10-10T10:34:00' },
  { id: 15, ten: 'Mô hình sản xuất nông hộ',                                    ma: 15, nhom: ['VS'],                        trang_thai: 'kich_hoat', created_at: '2024-10-10T10:55:00' },
  { id: 16, ten: 'Phòng hộ ven biển',                                            ma: 16, nhom: ['LN'],                        trang_thai: 'kich_hoat', created_at: '2024-11-19T15:21:00' },
];

export const PHUONG_THUC_MAP = Object.fromEntries(PHUONG_THUC_BAO_TON.map(p => [p.id, p]));

// Shared mutable stores — all components read/write here so status changes persist
export const danhMucStores = {
  phuongThuc: [...PHUONG_THUC_BAO_TON] as PhuongThucBaoTon[],
  hinhThucBaoTon: [...HINH_THUC_BAO_TON] as HinhThucBaoTon[],
  hinhThucKhaiThac: [...HINH_THUC_KHAI_THAC] as HinhThucKhaiThac[],
};
