"use client";

import { useState } from "react";
import { NguonGen, CATEGORIES } from "@/data/nguonGen";

interface EditModalProps {
  item: NguonGen;
  onSave: (updated: NguonGen) => void;
  onClose: () => void;
}

export default function EditModal({ item, onSave, onClose }: EditModalProps) {
  const [form, setForm] = useState<NguonGen>({ ...item });
  const [errors, setErrors] = useState<Partial<Record<keyof NguonGen, string>>>({});

  const set = (field: keyof NguonGen, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Partial<Record<keyof NguonGen, string>> = {};
    if (!form.ten.trim()) e.ten = "Không được để trống";
    if (!form.don_vi.trim()) e.don_vi = "Không được để trống";
    if (isNaN(form.lat) || form.lat < -90 || form.lat > 90) e.lat = "Vĩ độ không hợp lệ";
    if (isNaN(form.lng) || form.lng < -180 || form.lng > 180) e.lng = "Kinh độ không hợp lệ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  const Field = ({
    label, field, type = "text", required = false,
  }: {
    label: string;
    field: keyof NguonGen;
    type?: string;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={form[field] as string | number}
        onChange={(e) => set(field, type === "number" ? parseFloat(e.target.value) : e.target.value)}
        step={type === "number" ? "0.0001" : undefined}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          errors[field] ? "border-red-400" : "border-gray-300"
        }`}
      />
      {errors[field] && <p className="text-red-500 text-xs mt-0.5">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-teal-800 px-5 py-3 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white font-bold text-sm">Chỉnh sửa nguồn gen</h2>
            <p className="text-teal-200 text-xs mt-0.5 font-mono">{item.ma}</p>
          </div>
          <button onClick={onClose} className="text-teal-200 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 flex flex-col gap-3">
          <Field label="Tên giống" field="ten" required />
          <Field label="Tên khoa học" field="khoa_hoc" />
          <Field label="Đơn vị lưu giữ" field="don_vi" required />
          <Field label="Phân nhóm chi tiết" field="phan_nhom" />

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nhóm nguồn gen<span className="text-red-500 ml-0.5">*</span>
            </label>
            <select
              value={form.nhom}
              onChange={(e) => set("nhom", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Vĩ độ (lat)" field="lat" type="number" required />
            <Field label="Kinh độ (lng)" field="lng" type="number" required />
          </div>
        </form>

        <div className="flex gap-2 px-5 py-3 border-t border-gray-200 shrink-0 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-teal-700 hover:bg-teal-600 text-white text-sm py-2 rounded-lg transition-colors font-medium"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
