"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface GuideModalProps {
  onClose: () => void;
}

type SectionId =
  | "tong-quan"
  | "dang-nhap"
  | "ban-do"
  | "toolbar"
  | "nguon-gen"
  | "edit-form"
  | "import-export"
  | "danh-muc"
  | "thong-ke"
  | "tim-duong";

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: "tong-quan", label: "Tổng quan hệ thống", icon: "🏠" },
  { id: "dang-nhap", label: "Đăng nhập quản trị", icon: "🔐" },
  { id: "ban-do", label: "Sử dụng bản đồ", icon: "🗺️" },
  { id: "toolbar", label: "Thanh công cụ bản đồ", icon: "🧰" },
  { id: "nguon-gen", label: "Quản lý nguồn gen", icon: "🌾" },
  { id: "edit-form", label: "Cập nhật 4 biểu mẫu", icon: "📝" },
  { id: "import-export", label: "Nhập / xuất Excel", icon: "📥" },
  { id: "danh-muc", label: "Quản lý danh mục", icon: "📂" },
  { id: "thong-ke", label: "Thống kê & báo cáo", icon: "📊" },
  { id: "tim-duong", label: "Tìm đường đến nguồn gen", icon: "🧭" },
];

// ── Visual mock components (illustrate UI without screenshots) ──

function MockButton({ children, color = "green", icon }: { children: React.ReactNode; color?: "green" | "white" | "red"; icon?: string }) {
  const colorMap = {
    green: "bg-green-700 text-white",
    white: "bg-white text-gray-700 border border-gray-300",
    red: "bg-red-600 text-white",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium ${colorMap[color]}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}

function MockToolbar({ items }: { items: { icon: string; label: string }[] }) {
  return (
    <div className="inline-flex flex-col bg-green-700 rounded-lg p-1.5 gap-1 shadow-md max-w-full">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded text-white/90 text-base">
            {it.icon}
          </div>
          <span className="text-xs text-white/90 pr-2">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function Callout({ kind = "info", children }: { kind?: "info" | "warn" | "tip"; children: React.ReactNode }) {
  const styles = {
    info: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-900", icon: "ℹ️", title: "Ghi chú" },
    warn: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-900", icon: "⚠️", title: "Lưu ý" },
    tip: { bg: "bg-green-50", border: "border-green-300", text: "text-green-900", icon: "💡", title: "Mẹo" },
  };
  const s = styles[kind];
  return (
    <div className={`${s.bg} ${s.border} ${s.text} border-l-4 rounded-r p-3 my-3 text-sm`}>
      <p className="font-semibold mb-1">{s.icon} {s.title}</p>
      <div>{children}</div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="shrink-0 w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center">
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 mb-1">{title}</p>
        <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function MockHeader({ activeTab }: { activeTab: string }) {
  const tabs = [
    { id: "trang-chu", label: "Trang chủ", icon: "🏠" },
    { id: "danh-muc", label: "Danh mục", icon: "📂" },
    { id: "thong-ke", label: "Thống kê", icon: "📊" },
    { id: "nguon-gen", label: "Nguồn gen", icon: "🛡️" },
  ];
  return (
    <div className="bg-green-800 rounded shadow-md overflow-x-auto max-w-full">
      <div className="flex min-w-max">
        {tabs.map((t) => (
          <div
            key={t.id}
            className={`px-3 sm:px-4 py-2 text-xs font-medium border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === t.id ? "bg-white/10 text-white border-white" : "text-white/70 border-transparent"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section content ──────────────────────────────────────────────

function SectionTongQuan() {
  return (
    <>
      <p className="text-gray-700 mb-4">
        Hệ thống cơ sở dữ liệu quỹ gen tỉnh Thanh Hóa là công cụ tập trung phục vụ công tác bảo tồn, khai thác và sử dụng nguồn gen trên địa bàn tỉnh.
        Tài khoản <strong>quản trị</strong> được phép thêm, sửa, xóa, nhập / xuất dữ liệu và xem toàn bộ chức năng nâng cao.
      </p>

      <h3 className="font-semibold text-gray-900 mt-4 mb-2">Các phân hệ chính</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li>🗺️ <strong>Trang chủ (Bản đồ):</strong> hiển thị toàn bộ nguồn gen trên bản đồ tỉnh Thanh Hóa.</li>
        <li>📂 <strong>Danh mục:</strong> quản lý 6 danh mục nền (nhóm nguồn gen, đơn vị, phương thức bảo tồn, hình thức bảo tồn / khai thác, bài viết).</li>
        <li>📊 <strong>Thống kê:</strong> ba báo cáo theo đơn vị quản lý, đơn vị hành chính và nhóm nguồn gen.</li>
        <li>🛡️ <strong>Nguồn gen:</strong> bảng dữ liệu chi tiết — chỉnh sửa, thêm mới, xóa, nhập / xuất Excel.</li>
      </ul>

      <h3 className="font-semibold text-gray-900 mt-5 mb-2">Thanh điều hướng (admin)</h3>
      <div className="my-3">
        <MockHeader activeTab="nguon-gen" />
      </div>
      <p className="text-sm text-gray-600">Nhấn vào từng tab để chuyển phân hệ. Tab có biểu tượng mũi tên ▾ là menu thả xuống với nhiều mục con.</p>
    </>
  );
}

function SectionDangNhap() {
  return (
    <>
      <Step n={1} title="Mở trang chủ">
        Truy cập hệ thống bằng trình duyệt. Mặc định trang chủ hiển thị bản đồ ở chế độ khách (chỉ xem).
      </Step>
      <Step n={2} title="Nhấn nút Đăng nhập">
        Ở góc trên bên phải có nút <MockButton color="white" icon="👤">Đăng nhập</MockButton>. Trên điện thoại, vào thanh dưới và chọn <strong>Đăng nhập</strong>.
      </Step>
      <Step n={3} title="Nhập tài khoản quản trị">
        Điền tên đăng nhập và mật khẩu do đơn vị cấp. Sau khi xác thực thành công, hệ thống mở các tab quản trị và biểu tượng người dùng đổi thành <MockButton color="white" icon="👤">Quản trị ▾</MockButton>.
      </Step>
      <Step n={4} title="Đăng xuất">
        Nhấn vào <MockButton color="white" icon="👤">Quản trị ▾</MockButton> → chọn <strong className="text-red-600">Đăng xuất</strong> để trở về chế độ khách.
      </Step>
      <Callout kind="warn">
        Khi đăng xuất, mọi thao tác chỉnh sửa chưa lưu sẽ bị hủy. Hãy nhấn <strong>Lưu</strong> ở biểu mẫu trước khi đăng xuất.
      </Callout>
    </>
  );
}

function SectionBanDo() {
  return (
    <>
      <p className="text-gray-700 mb-3">
        Bản đồ là phân hệ trung tâm. Mỗi nguồn gen được biểu diễn bằng một <strong>marker</strong>;
        màu / icon thể hiện <em>phân nhóm</em> mà nguồn gen thuộc về.
      </p>

      <h3 className="font-semibold text-gray-900 mt-4 mb-2">Thao tác cơ bản</h3>
      <ul className="space-y-1.5 text-sm text-gray-700 list-disc pl-5">
        <li><strong>Phóng to / thu nhỏ:</strong> cuộn chuột, hoặc dùng nút 🔍 trên thanh công cụ.</li>
        <li><strong>Di chuyển:</strong> nhấn giữ chuột trái và kéo (hoặc vuốt trên điện thoại).</li>
        <li><strong>Xem chi tiết:</strong> nhấn vào marker → popup nhỏ hiện ra → nhấn <strong>Xem chi tiết</strong> để mở biểu mẫu đầy đủ.</li>
        <li><strong>Lọc theo nhóm:</strong> dùng sidebar bên trái (hoặc thanh nhóm phía trên trên điện thoại) để lọc theo Nông nghiệp, Lâm nghiệp, Dược liệu, Vật nuôi, Thủy sản, VSV-Nấm.</li>
      </ul>

      <h3 className="font-semibold text-gray-900 mt-5 mb-2">Sidebar nguồn gen</h3>
      <div className="my-3 max-w-xs bg-white border border-gray-300 rounded shadow-sm text-xs">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 font-semibold">Danh sách nguồn gen</div>
        <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
          <span className="text-base">🌾</span>
          <div>
            <div className="font-medium">Lúa nếp cẩm</div>
            <div className="text-gray-500 text-[10px]">NG001 · Nông nghiệp</div>
          </div>
        </div>
        <div className="px-3 py-2 flex items-center gap-2">
          <span className="text-base">🐟</span>
          <div>
            <div className="font-medium">Cá rô đầm sét</div>
            <div className="text-gray-500 text-[10px]">NG002 · Thủy sản</div>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">Nhấn vào một dòng trong sidebar để bay tới vị trí và mở biểu mẫu chi tiết.</p>
    </>
  );
}

function SectionToolbar() {
  return (
    <>
      <p className="text-gray-700 mb-3">
        Thanh công cụ nằm bên phải bản đồ. Các nút có biểu tượng 🔒 mờ chỉ hoạt động khi đã đăng nhập admin.
      </p>

      <div className="flex gap-4 my-4">
        <MockToolbar items={[
          { icon: "➕", label: "Phóng to" },
          { icon: "➖", label: "Thu nhỏ" },
          { icon: "📏", label: "Đo khoảng cách / Diện tích" },
          { icon: "🗑️", label: "Xóa nguồn gen (admin)" },
          { icon: "📍", label: "Thêm mới nguồn gen (admin)" },
          { icon: "🖼️", label: "Xuất ảnh bản đồ (admin)" },
          { icon: "📄", label: "Xuất PDF (admin)" },
          { icon: "🏷️", label: "Chú giải (admin)" },
          { icon: "🧭", label: "Tìm đường (admin)" },
        ]} />
      </div>

      <h3 className="font-semibold text-gray-900 mt-4 mb-2">Hướng dẫn từng công cụ</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><strong>📏 Đo khoảng cách / Diện tích:</strong> nhấn để bật công cụ → nhấn các điểm trên bản đồ. Nhấn đôi điểm cuối để hoàn tất. Hệ thống hiển thị độ dài / diện tích thực tế.</li>
        <li><strong>🗑️ Xóa nguồn gen:</strong> bật công cụ → nhấn vào marker cần xóa → xác nhận. Thao tác không thể hoàn tác.</li>
        <li><strong>📍 Thêm mới nguồn gen:</strong> bật công cụ → nhấn vào vị trí trên bản đồ. Biểu mẫu mở ra với toạ độ điền sẵn.</li>
        <li><strong>🖼️ Xuất ảnh bản đồ:</strong> chụp lại khung bản đồ đang hiển thị thành file PNG.</li>
        <li><strong>📄 Xuất PDF:</strong> tạo file PDF chứa bản đồ + chú giải, phục vụ báo cáo.</li>
        <li><strong>🏷️ Chú giải:</strong> bật / tắt bảng chú giải hiển thị màu sắc - phân nhóm.</li>
        <li><strong>🧭 Tìm đường:</strong> mở phân hệ tìm đường đi từ vị trí của bạn đến một nguồn gen.</li>
      </ul>

      <Callout kind="warn">
        Khi xóa nguồn gen, toàn bộ dữ liệu 4 biểu mẫu và ảnh đính kèm cũng bị xóa theo. Hãy cân nhắc kỹ trước khi thực hiện.
      </Callout>
    </>
  );
}

function SectionNguonGen() {
  return (
    <>
      <p className="text-gray-700 mb-3">
        Vào tab <MockButton color="green" icon="🛡️">Nguồn gen ▾</MockButton> trên thanh điều hướng → chọn một nhóm (Nông nghiệp, Lâm nghiệp, Dược liệu, Vật nuôi, Thủy sản, VSV-Nấm).
        Bảng dữ liệu chi tiết của nhóm đó sẽ hiển thị.
      </p>

      <h3 className="font-semibold text-gray-900 mt-4 mb-2">Giao diện bảng quản lý</h3>
      <div className="my-3 overflow-x-auto max-w-full -mx-1 px-1">
        <div className="inline-block bg-white border border-gray-300 rounded shadow-sm text-xs">
          <div className="bg-slate-600 text-white px-3 py-2 flex gap-2 whitespace-nowrap">
            <span>#</span><span className="w-16">Mã</span><span className="w-32">Tên</span><span className="w-24">Đơn vị</span><span>Thao tác</span>
          </div>
          <div className="px-3 py-2 border-b border-gray-100 flex gap-2 items-center whitespace-nowrap">
            <span>1</span>
            <span className="w-16 text-gray-600">NG001</span>
            <span className="w-32 font-medium">Lúa nếp cẩm</span>
            <span className="w-24 text-gray-600">Hộ gia đình</span>
            <span className="flex gap-1">
              <MockButton color="white" icon="✏️">Sửa</MockButton>
              <MockButton color="red" icon="🗑️">Xóa</MockButton>
            </span>
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mt-5 mb-2">Các thao tác</h3>
      <Step n={1} title="Tìm kiếm">
        Gõ mã hoặc tên vào ô tìm kiếm phía trên bảng. Kết quả lọc tức thời.
      </Step>
      <Step n={2} title="Lọc theo phân nhóm">
        Dùng dropdown <strong>Phân nhóm</strong> để thu hẹp kết quả (ví dụ: trong Nông nghiệp có Lúa, Ngô, Đậu...).
      </Step>
      <Step n={3} title="Thêm mới">
        Nhấn <MockButton color="green" icon="➕">Thêm mới</MockButton> ở góc trên bên phải → điền 4 biểu mẫu → <strong>Lưu</strong>.
      </Step>
      <Step n={4} title="Sửa">
        Nhấn biểu tượng ✏️ ở dòng cần sửa → cập nhật → <strong>Lưu</strong>.
      </Step>
      <Step n={5} title="Xóa">
        Nhấn biểu tượng 🗑️ → xác nhận. Dữ liệu 4 biểu mẫu cũng bị xóa.
      </Step>
      <Step n={6} title="Tải Excel chi tiết">
        Nhấn 📥 ở dòng để tải file Excel chứa đầy đủ 4 biểu mẫu của riêng nguồn gen đó.
      </Step>
    </>
  );
}

function SectionEditForm() {
  return (
    <>
      <p className="text-gray-700 mb-3">
        Khi mở chỉnh sửa một nguồn gen, hệ thống hiển thị <strong>4 biểu mẫu</strong> được chuyển qua lại bằng các tab phía trên modal.
      </p>

      <div className="my-3 overflow-x-auto -mx-1 px-1">
        <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1 text-xs whitespace-nowrap">
          <div className="px-3 py-1.5 bg-white rounded shadow-sm font-medium">Form 1 · Thông tin cơ bản</div>
          <div className="px-3 py-1.5 text-gray-600">Form 2 · Điều tra</div>
          <div className="px-3 py-1.5 text-gray-600">Form 3 · Đánh giá ban đầu</div>
          <div className="px-3 py-1.5 text-gray-600">Form 4 · Đánh giá chi tiết</div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mt-4 mb-2">Nội dung mỗi biểu mẫu</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><strong>Form 1 — Thông tin cơ bản:</strong> mã, tên, tên khoa học, đơn vị quản lý, nhóm, phân nhóm, toạ độ (lat/lng), ảnh đại diện.</li>
        <li><strong>Form 2 — Điều tra:</strong> thông tin điều tra ban đầu: nơi phân bố, đặc điểm sinh thái, tình trạng quần thể.</li>
        <li><strong>Form 3 — Đánh giá ban đầu:</strong> chỉ tiêu hình thái, năng suất, chất lượng sơ bộ.</li>
        <li><strong>Form 4 — Đánh giá chi tiết:</strong> phân tích chuyên sâu, dữ liệu thí nghiệm, khuyến nghị bảo tồn.</li>
      </ul>

      <Callout kind="tip">
        Nhấn <strong>Lưu</strong> ở bất kỳ biểu mẫu nào sẽ lưu cả 4 biểu mẫu cùng lúc. Có thể chuyển tab giữa chừng, dữ liệu chưa lưu vẫn được giữ trong bộ nhớ tạm.
      </Callout>

      <h3 className="font-semibold text-gray-900 mt-5 mb-2">Ảnh đính kèm</h3>
      <p className="text-sm text-gray-700">
        Trong Form 1 có thể tải lên nhiều ảnh cho mỗi nguồn gen. Nhấn <MockButton color="white" icon="📷">Chọn ảnh</MockButton> → chọn file → nhấn <strong>Tải lên</strong>.
        Ảnh sẽ hiển thị trong popup và trang chi tiết.
      </p>
    </>
  );
}

function SectionImportExport() {
  return (
    <>
      <h3 className="font-semibold text-gray-900 mb-2">Nhập từ Excel</h3>
      <Step n={1} title="Mở bảng nguồn gen">
        Chọn một nhóm nguồn gen ở tab <MockButton color="green" icon="🛡️">Nguồn gen ▾</MockButton>.
      </Step>
      <Step n={2} title="Nhấn nút Nhập Excel">
        Ở thanh công cụ trên bảng, nhấn <MockButton color="white" icon="📥">Nhập Excel</MockButton>.
      </Step>
      <Step n={3} title="Chọn file">
        Chọn file Excel đúng mẫu (tải mẫu từ chính dialog Nhập Excel). Hệ thống kiểm tra cột và báo lỗi nếu sai định dạng.
      </Step>
      <Step n={4} title="Xác nhận">
        Sau khi xem trước, nhấn <strong>Nhập vào hệ thống</strong>. Các bản ghi trùng mã sẽ được cập nhật, bản ghi mới sẽ được thêm.
      </Step>

      <h3 className="font-semibold text-gray-900 mt-5 mb-2">Xuất Excel</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><MockButton color="white" icon="📤">Xuất danh sách</MockButton> — xuất bảng đang lọc (theo nhóm, phân nhóm, từ khóa tìm kiếm) thành 1 file Excel.</li>
        <li><MockButton color="white" icon="📑">Xuất chi tiết</MockButton> — xuất toàn bộ 4 biểu mẫu của tất cả nguồn gen trong nhóm hiện tại.</li>
        <li>Biểu tượng 📥 ở mỗi dòng — xuất chi tiết 4 biểu mẫu riêng cho 1 nguồn gen.</li>
      </ul>

      <Callout kind="warn">
        Khi nhập Excel với dữ liệu lớn, vui lòng chờ thanh tiến trình hoàn tất. Đóng tab giữa chừng có thể làm dữ liệu nhập dở dang.
      </Callout>
    </>
  );
}

function SectionDanhMuc() {
  return (
    <>
      <p className="text-gray-700 mb-3">
        Vào tab <MockButton color="green" icon="📂">Danh mục ▾</MockButton> → chọn một trong sáu danh mục nền:
      </p>
      <ul className="space-y-1.5 text-sm text-gray-700 list-disc pl-5">
        <li><strong>Nhóm nguồn gen</strong> — 6 nhóm chính (Nông nghiệp, Lâm nghiệp, Dược liệu, Vật nuôi, Thủy sản, VSV-Nấm).</li>
        <li><strong>Đơn vị sản xuất, cung cấp gen giống</strong> — danh sách các đơn vị, hộ gia đình quản lý nguồn gen.</li>
        <li><strong>Phương thức bảo tồn</strong> — Bảo tồn tại chỗ (in-situ), bảo tồn chuyển chỗ (ex-situ)...</li>
        <li><strong>Hình thức bảo tồn</strong> — Vườn, ngân hàng gen, trang trại...</li>
        <li><strong>Hình thức khai thác, sử dụng</strong> — Thực phẩm, dược liệu, giống, nghiên cứu...</li>
        <li><strong>Bài viết khai thác, bảo tồn, sử dụng</strong> — kho bài viết / tài liệu chuyên đề.</li>
      </ul>

      <Callout kind="info">
        Mỗi danh mục là một bảng độc lập với chức năng tìm kiếm, thêm, sửa, xóa. Cập nhật ở đây sẽ ảnh hưởng đến các dropdown khi chỉnh sửa biểu mẫu nguồn gen.
      </Callout>
    </>
  );
}

function SectionThongKe() {
  return (
    <>
      <p className="text-gray-700 mb-3">
        Vào tab <MockButton color="green" icon="📊">Thống kê ▾</MockButton> để xem ba báo cáo:
      </p>

      <h3 className="font-semibold text-gray-900 mt-3 mb-2">1. Nguồn gen theo đơn vị quản lý</h3>
      <p className="text-sm text-gray-700">
        Bảng tổng hợp số lượng nguồn gen mà mỗi đơn vị / hộ gia đình đang quản lý. Hỗ trợ sắp xếp và xuất Excel.
      </p>

      <h3 className="font-semibold text-gray-900 mt-4 mb-2">2. Nguồn gen theo đơn vị hành chính</h3>
      <p className="text-sm text-gray-700">
        Phân bố nguồn gen theo huyện / xã. Dùng để báo cáo cấp tỉnh, đánh giá vùng tập trung.
      </p>

      <h3 className="font-semibold text-gray-900 mt-4 mb-2">3. Nguồn gen theo nhóm nguồn gen</h3>
      <p className="text-sm text-gray-700">
        Số lượng nguồn gen của từng nhóm và phân nhóm — phục vụ phân tích đa dạng sinh học.
      </p>

      <Callout kind="tip">
        Mỗi bảng thống kê đều có nút <MockButton color="white" icon="📤">Xuất Excel</MockButton> ở góc trên bên phải để tải về máy.
      </Callout>
    </>
  );
}

function SectionTimDuong() {
  return (
    <>
      <p className="text-gray-700 mb-3">
        Phân hệ <strong>Tìm đường</strong> giúp xác định lộ trình từ vị trí của bạn đến một nguồn gen cụ thể trên bản đồ.
      </p>
      <Step n={1} title="Mở phân hệ">
        Trên bản đồ, nhấn nút 🧭 <strong>Tìm đường</strong> ở thanh công cụ bên phải.
      </Step>
      <Step n={2} title="Cho phép định vị">
        Trình duyệt sẽ yêu cầu quyền truy cập vị trí. Nhấn <strong>Cho phép</strong> để hệ thống biết điểm xuất phát.
      </Step>
      <Step n={3} title="Chọn điểm đến">
        Chọn một nguồn gen trong danh sách bên trái (hoặc nhấn marker trên bản đồ).
      </Step>
      <Step n={4} title="Xem lộ trình">
        Hệ thống vẽ đường đi, hiển thị khoảng cách và thời gian dự kiến. Có thể chuyển giữa các phương tiện (ô tô, xe máy, đi bộ).
      </Step>
      <Callout kind="info">
        Lộ trình tham khảo dựa trên dữ liệu OpenStreetMap. Trong khu vực miền núi, đường thực tế có thể khác hiển thị.
      </Callout>
    </>
  );
}

const SECTION_RENDERERS: Record<SectionId, () => React.ReactElement> = {
  "tong-quan": SectionTongQuan,
  "dang-nhap": SectionDangNhap,
  "ban-do": SectionBanDo,
  "toolbar": SectionToolbar,
  "nguon-gen": SectionNguonGen,
  "edit-form": SectionEditForm,
  "import-export": SectionImportExport,
  "danh-muc": SectionDanhMuc,
  "thong-ke": SectionThongKe,
  "tim-duong": SectionTimDuong,
};

export default function GuideModal({ onClose }: GuideModalProps) {
  const [active, setActive] = useState<SectionId>("tong-quan");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  const Renderer = SECTION_RENDERERS[active];
  const activeMeta = SECTIONS.find((s) => s.id === active)!;

  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-black/50 flex items-stretch sm:items-center justify-center sm:p-6">
      <div className="bg-white w-full h-full max-w-6xl sm:max-h-[95vh] sm:rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 bg-green-700 text-white px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            className="md:hidden p-1.5 rounded hover:bg-white/20"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Mở mục lục"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base sm:text-lg leading-tight">Hướng dẫn sử dụng hệ thống</h2>
            <p className="text-xs text-white/70 hidden sm:block">Dành cho tài khoản quản trị</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-white/20 transition-colors"
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Sidebar (desktop) */}
          <aside className="hidden md:flex w-64 shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto flex-col">
            <nav className="p-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium flex items-center gap-2.5 mb-0.5 transition-colors ${
                    active === s.id
                      ? "bg-green-100 text-green-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="flex-1 min-w-0">{s.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Sidebar (mobile drawer) */}
          {sidebarOpen && (
            <>
              <div className="md:hidden fixed inset-0 bg-black/40 z-[10001]" onClick={() => setSidebarOpen(false)} />
              <aside className="md:hidden fixed top-0 bottom-0 left-0 w-72 bg-white z-[10002] overflow-y-auto shadow-2xl">
                <div className="px-4 py-3 bg-green-700 text-white font-semibold flex items-center justify-between">
                  Mục lục
                  <button onClick={() => setSidebarOpen(false)} aria-label="Đóng">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <nav className="p-2">
                  {SECTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setActive(s.id); setSidebarOpen(false); }}
                      className={`w-full text-left px-3 py-3 rounded text-sm font-medium flex items-center gap-2.5 mb-0.5 ${
                        active === s.id ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-base">{s.icon}</span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </nav>
              </aside>
            </>
          )}

          {/* Content */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{activeMeta.icon}</span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{activeMeta.label}</h2>
              </div>
              <div className="prose prose-sm max-w-none">
                <Renderer />
              </div>

              {/* Footer nav */}
              <div className="mt-10 pt-5 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    const i = SECTIONS.findIndex((s) => s.id === active);
                    if (i > 0) setActive(SECTIONS[i - 1].id);
                  }}
                  disabled={SECTIONS.findIndex((s) => s.id === active) === 0}
                  className="text-sm text-green-700 font-medium disabled:text-gray-300 disabled:cursor-not-allowed hover:text-green-800"
                >
                  ← Mục trước
                </button>
                <button
                  onClick={() => {
                    const i = SECTIONS.findIndex((s) => s.id === active);
                    if (i < SECTIONS.length - 1) setActive(SECTIONS[i + 1].id);
                  }}
                  disabled={SECTIONS.findIndex((s) => s.id === active) === SECTIONS.length - 1}
                  className="text-sm text-green-700 font-medium disabled:text-gray-300 disabled:cursor-not-allowed hover:text-green-800"
                >
                  Mục tiếp theo →
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>,
    document.body
  );
}
