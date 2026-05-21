"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { BAI_VIET_DATA } from "@/data/baiVietData";
import { normalizeVi } from "@/lib/text";
import AutoTextarea from "@/components/AutoTextarea";

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

const API = "/api/bai-viet";

const TH = "border border-gray-500 px-2 py-1.5 text-center text-[13px] font-semibold leading-tight align-middle bg-white";
const TD = "border border-gray-400 px-1 py-0.5 text-[13px] leading-tight align-middle";

const COLORS = [
  "#000000","#434343","#666666","#999999","#b7b7b7","#cccccc","#d9d9d9","#ffffff",
  "#ff0000","#ff9900","#ffff00","#00ff00","#00ffff","#4a86e8","#0000ff","#9900ff",
  "#ff00ff","#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6d9eeb","#8e7cc3",
  "#c27ba0","#cc0000","#e69138","#f1c232","#6aa84f","#45818e","#3c78d8","#674ea7",
  "#a64d79","#990000","#b45f06","#bf9000","#38761d","#134f5c","#1155cc","#351c75",
];

const EMOJIS = [
  "😊","😂","🥰","😍","🤣","😎","😭","😅","🙏","👍","👎","✌️","🤝","❤️","🔥",
  "⭐","✅","❌","💡","📝","📌","🔍","💎","🎉","🎊","🏆","🌸","🌺","🌻","🌿",
  "🍀","🍎","🍊","🍋","🌍","📊","📈","📉","🗂️","📂","💼","🔬","🧬","🌱","🌾",
];

const SPECIAL_CHARS = [
  "©","®","™","°","±","×","÷","≤","≥","≠","≈","∞","√","∑","∏","∫",
  "α","β","γ","δ","ε","λ","μ","π","σ","φ","ω","Δ","Ω","Σ","Π",
  "→","←","↑","↓","↔","⇒","⇐","⇔","•","·","…","—","–","«","»","„",
];

const FONTS = ["Arial","Times New Roman","Courier New","Georgia","Verdana","Tahoma","Trebuchet MS"];
const FONT_SIZES = ["8","9","10","11","12","14","16","18","20","24","28","36","48","72"];
const HEADING_STYLES: [string, string][] = [
  ["Normal","p"],["Tiêu đề 1","h1"],["Tiêu đề 2","h2"],["Tiêu đề 3","h3"],
  ["Tiêu đề 4","h4"],["Tiêu đề 5","h5"],["Code","pre"],
];

export default function BaiVietKhaiThacPage(_props: Record<string, unknown>) {
  const [tieuDe, setTieuDe] = useState(
    "DANH MỤC HIỆN TRẠNG BẢO TỒN; KHAI THÁC, SỬ DỤNG NGUỒN GEN TRÊN ĐỊA BÀN TỈNH THANH HÓA"
  );
  const [moTa, setMoTa] = useState("");
  const [rows, setRows] = useState<BaiVietRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [mobileMetaOpen, setMobileMetaOpen] = useState(false);
  const [history, setHistory] = useState<BaiVietRow[][]>([]);
  const [future, setFuture]   = useState<BaiVietRow[][]>([]);
  const [showSearch, setShowSearch]   = useState(false);
  const [search, setSearch]           = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const [replaceFrom, setReplaceFrom] = useState("");
  const [replaceTo, setReplaceTo]     = useState("");

  // Popup state: which popup is open
  const [popup, setPopup]       = useState<string | null>(null);
  const [linkUrl, setLinkUrl]   = useState("https://");
  const [imgUrl, setImgUrl]     = useState("https://");
  const [imgAlt, setImgAlt]     = useState("");
  const [vidUrl, setVidUrl]     = useState("https://");
  const [tRows, setTRows]       = useState(3);
  const [tCols, setTCols]       = useState(3);
  const [htmlView, setHtmlView] = useState("");
  const [hoverCell, setHoverCell] = useState<[number, number]>([0, 0]);

  const contentRef    = useRef<HTMLDivElement>(null);
  const editorRef     = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const skipAutoSaveRef = useRef(true); // true until user makes first real edit
  const modalTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from server on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error(await res.text());
        const { rows: dbRows, meta } = await res.json() as {
          rows: BaiVietRow[];
          meta: Record<string, string>;
        };
        const sortByTen = (arr: BaiVietRow[]) =>
          [...arr].sort((a, b) => a.ten.localeCompare(b.ten, "vi"));

        skipAutoSaveRef.current = true; // don't auto-save on initial load
        if (dbRows.length > 0) {
          setRows(sortByTen(dbRows));
        } else {
          // First run: seed from static data and persist
          const seed = sortByTen(BAI_VIET_DATA.map((r) => ({ ...r, id: String(r.tt) })));
          setRows(seed);
          fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rows: seed, meta: { tieu_de: tieuDe, mo_ta: moTa } }),
          });
        }
        if (meta?.tieu_de) setTieuDe(meta.tieu_de);
        if (meta?.mo_ta)   setMoTa(meta.mo_ta);
      } catch {
        skipAutoSaveRef.current = true;
        setRows(
          [...BAI_VIET_DATA]
            .sort((a, b) => a.ten.localeCompare(b.ten, "vi"))
            .map((r) => ({ ...r, id: String(r.tt) }))
        );
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Selection helpers ──────────────────────────────────────────────────────
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
  };

  const exec = (cmd: string, val?: string) => {
    const r = savedRangeRef.current;
    if (r) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(r);
    }
    document.execCommand(cmd, false, val);
  };

  const openPopup = (name: string) => {
    saveSelection();
    if (name === "html") setHtmlView(editorRef.current?.innerHTML ?? "");
    setPopup(name);
  };
  const closePopup = () => setPopup(null);

  // ── Row mutations ─────────────────────────────────────────────────────────
  const pushHistory = (snap: BaiVietRow[]) => {
    setHistory((h) => [...h.slice(-30), snap]);
    setFuture([]);
  };

  const handleCellChange = (id: string, col: keyof BaiVietRow, val: string) => {
    pushHistory(rows);
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [col]: val } : r));
  };

  const deleteRow = (id: string) => { pushHistory(rows); setRows((p) => p.filter((r) => r.id !== id)); };
  const addRow = (nhom: string) => {
    pushHistory(rows);
    setRows((p) => [...p, {
      id: `new-${Date.now()}`, nhom, ten: "", khoa_hoc: "", dang_mau: "", tu_lieu: "",
      dg_ban_dau: "", dg_chi_tiet: "", chua_bt: "", pt_bt: "", ht_bt: "", noi_bt: "", dv_bt: "",
      chua_kt: "", ht_kt: "", dia_diem: "", dv_kt: "", ghi_chu: "",
    }]);
  };

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setFuture((f) => [rows, ...f.slice(0, 30)]);
    setHistory((h) => h.slice(0, -1));
    setRows(prev);
  };
  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setHistory((h) => [...h.slice(-30), rows]);
    setFuture((f) => f.slice(1));
    setRows(next);
  };

  // DOM toast — always fires, not gated by React re-render
  const showToast = () => {
    document.getElementById("bvkt-toast")?.remove();
    const el = document.createElement("div");
    el.id = "bvkt-toast";
    el.style.cssText =
      "position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;pointer-events:none";
    el.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:36px 52px;
        box-shadow:0 24px 64px rgba(0,0,0,0.18);border:1px solid #dcfce7;
        display:flex;flex-direction:column;align-items:center;gap:14px">
        <div style="width:64px;height:64px;background:#f0fdf4;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 0 6px #dcfce7">
          <svg width="36" height="36" fill="none" stroke="#16a34a" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <p style="font-size:17px;font-weight:700;color:#111827;margin:0">Lưu thành công!</p>
        <p style="font-size:13px;color:#6b7280;margin:0">Tất cả thay đổi đã được lưu vào cơ sở dữ liệu</p>
      </div>`;
    document.body.appendChild(el);
    if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    modalTimerRef.current = setTimeout(() => el.remove(), 2500);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const showErrorToast = (msg: string) => {
    document.getElementById("bvkt-toast")?.remove();
    const el = document.createElement("div");
    el.id = "bvkt-toast";
    el.style.cssText =
      "position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;pointer-events:none";
    el.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:32px 48px;
        box-shadow:0 24px 64px rgba(0,0,0,0.18);border:1px solid #fee2e2;
        display:flex;flex-direction:column;align-items:center;gap:12px">
        <div style="width:56px;height:56px;background:#fef2f2;border-radius:50%;
          display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 5px #fee2e2">
          <svg width="32" height="32" fill="none" stroke="#dc2626" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
        </div>
        <p style="font-size:16px;font-weight:700;color:#111827;margin:0">Lỗi khi lưu!</p>
        <p style="font-size:12px;color:#6b7280;margin:0;max-width:300px;text-align:center">${msg}</p>
      </div>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  };

  const doSaveToServer = async (currentRows: BaiVietRow[], currentTieuDe: string, currentMoTa: string) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rows: currentRows,
        meta: { tieu_de: currentTieuDe, mo_ta: currentMoTa },
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error ?? res.statusText);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await doSaveToServer(rows, tieuDe, moTa);
      showToast();
    } catch (e) {
      showErrorToast(String(e));
    } finally {
      setSaving(false);
    }
  };

  // Auto-save on any change (debounced 1s, skips on initial data load)
  useEffect(() => {
    if (loading) return;
    if (skipAutoSaveRef.current) { skipAutoSaveRef.current = false; return; }
    const t = setTimeout(async () => {
      try {
        await doSaveToServer(rows, tieuDe, moTa);
        showToast();
      } catch { /* silent — user can retry with manual save */ }
    }, 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, tieuDe, moTa]);

  const handleReplace = () => {
    if (!replaceFrom.trim()) return;
    pushHistory(rows);
    setRows((prev) => prev.map((r) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const u: any = { ...r };
      Object.keys(u).forEach((k) => { if (k !== "id" && typeof u[k] === "string") u[k] = u[k].replaceAll(replaceFrom, replaceTo); });
      return u as BaiVietRow;
    }));
  };

  const handlePrint = () => window.print();
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) contentRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // ── Toolbar action handlers ────────────────────────────────────────────────
  const applyColor = (color: string, mode: "fore" | "back") => {
    exec(mode === "fore" ? "foreColor" : "backColor", color);
    closePopup();
  };
  const insertEmoji = (em: string) => { exec("insertText", em); closePopup(); };
  const insertSpecial = (ch: string) => { exec("insertText", ch); closePopup(); };
  const insertLink = () => {
    if (linkUrl && linkUrl !== "https://") exec("createLink", linkUrl);
    closePopup();
  };
  const insertImage = () => {
    if (imgUrl && imgUrl !== "https://") exec("insertHTML", `<img src="${imgUrl}" alt="${imgAlt}" style="max-width:100%"/>`);
    closePopup();
  };
  const insertVideo = () => {
    if (vidUrl && vidUrl !== "https://") {
      const ytMatch = vidUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
      const src = ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : vidUrl;
      exec("insertHTML", `<iframe src="${src}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`);
    }
    closePopup();
  };
  const insertTable = () => {
    const header = `<tr>${Array(tCols).fill('<th style="border:1px solid #999;padding:4px;background:#f0f0f0">Tiêu đề</th>').join("")}</tr>`;
    const bodyRow = `<tr>${Array(tCols).fill('<td style="border:1px solid #ccc;padding:4px">&nbsp;</td>').join("")}</tr>`;
    const body = Array(Math.max(1, tRows - 1)).fill(bodyRow).join("");
    exec("insertHTML", `<table style="border-collapse:collapse;width:100%"><thead>${header}</thead><tbody>${body}</tbody></table>`);
    closePopup();
  };
  const applyHtml = () => { if (editorRef.current) editorRef.current.innerHTML = htmlView; closePopup(); };

  // ── Grouped data ──────────────────────────────────────────────────────────
  const grouped = useMemo(() => {
    let offset = 0;
    return NHOM_SECTIONS.map((s) => {
      const sRows = rows.filter((r) => r.nhom === s.id);
      const startIndex = offset;
      offset += sRows.length;
      return { ...s, rows: sRows, startIndex };
    });
  }, [rows]);

  const filteredGrouped = useMemo(() => {
    const q = normalizeVi(search.trim());
    if (!q) return grouped;
    let offset = 0;
    return grouped.map((g) => {
      const sRows = g.rows.filter((r) =>
        normalizeVi(r.ten).includes(q) || normalizeVi(r.khoa_hoc).includes(q) ||
        normalizeVi(r.dia_diem).includes(q) || normalizeVi(r.noi_bt).includes(q)
      );
      const startIndex = offset;
      offset += sRows.length;
      return { ...g, rows: sRows, startIndex };
    });
  }, [grouped, search]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 gap-3">
        <svg className="w-6 h-6 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-sm text-gray-500">Đang tải dữ liệu từ cơ sở dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden bg-gray-100">
      {/* Mobile backdrop for meta panel */}
      {mobileMetaOpen && (
        <div className="fixed inset-0 bg-black/40 z-[55] md:hidden" onClick={() => setMobileMetaOpen(false)} />
      )}

      {/* ── Left panel ── */}
      <aside className={`fixed inset-y-0 left-0 z-[60] md:static md:z-auto w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col transition-transform md:transition-none ${mobileMetaOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="md:hidden flex items-center justify-between px-4 pt-3 pb-1">
          <span className="text-sm font-semibold text-gray-700">Tiêu đề &amp; mô tả</span>
          <button onClick={() => setMobileMetaOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-4 py-3 border-b border-gray-200">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            <span className="text-red-500 mr-0.5">*</span>Tiêu đề
          </label>
          <AutoTextarea value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} minRows={6}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400" />
        </div>
        <div className="px-4 py-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">Mô tả ngắn</label>
          <AutoTextarea value={moTa} onChange={(e) => setMoTa(e.target.value)} minRows={8}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
            placeholder="Nhập mô tả ngắn..." />
        </div>
      </aside>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar — z-50 so it stays above the popup overlay (z-40) */}
        <div className="relative z-50 flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-white border-b border-gray-200 shrink-0">
          <button
            className="md:hidden p-1.5 rounded text-gray-600 hover:bg-gray-100 shrink-0"
            onClick={() => setMobileMetaOpen(true)}
            title="Tiêu đề & mô tả"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
          <h1 className="text-xs md:text-sm font-semibold text-gray-800 flex-1 min-w-0 truncate">Bài viết khai thác, bảo tồn, sử dụng</h1>
          <div className="hidden md:flex flex-1" />
          <button onClick={handleSave} disabled={saving || loading}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors">
            {saving ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 3v5H8V3m4 13a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            )}
            {saving ? "Đang lưu..." : "Lưu lại"}
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="relative z-50 bg-gray-50 border-b border-gray-300 px-2 py-1 space-y-0.5 shrink-0">
          {/* Row 1 */}
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
            <TBtn label="Mã HTML" onClick={() => openPopup("html")} active={popup === "html"} />
            <Sep />
            <IBtn title="In" icon="🖨" onClick={handlePrint} />
            <IBtn title="Xem trước" icon="📄" onClick={handlePrint} />
            <IBtn title="Lưu" icon="💾" onClick={handleSave} active={savedMsg} />
            <IBtn title="Mẫu" icon="📋" />
            <Sep />
            <IBtn title="Cắt" icon="✂" onClick={() => document.execCommand("cut")} />
            <IBtn title="Sao chép" icon="⿻" onClick={() => document.execCommand("copy")} />
            <IBtn title="Dán" icon="📌" onClick={() => document.execCommand("paste")} />
            <IBtn title="Dán văn bản" icon="📑" onClick={() => { saveSelection(); navigator.clipboard?.readText().then(t => exec("insertText", t)); }} />
            <Sep />
            <IBtn title="Hoàn tác (Ctrl+Z)" icon="↩" onClick={undo} disabled={history.length === 0} />
            <IBtn title="Làm lại (Ctrl+Y)" icon="↪" onClick={redo} disabled={future.length === 0} />
            <Sep />
            <IBtn title="Tìm kiếm" icon="🔍" onClick={() => { setShowSearch((v) => !v); setShowReplace(false); }} active={showSearch} />
            <IBtn title="Thay thế" icon="🔄" onClick={() => { setShowReplace((v) => !v); setShowSearch(false); }} active={showReplace} />
            <Sep />
            <IBtn title="Kiểm tra chính tả" icon="ABC" onClick={() => document.execCommand("checkSpelling")} />
            <Sep />
            <IBtn title="Chọn tất cả" icon="⬚" onClick={() => { saveSelection(); const el = editorRef.current; if (el) { const r = document.createRange(); r.selectNodeContents(el); const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(r); } }} />
            <IBtn title="Toàn màn hình" icon="⛶" onClick={toggleFullscreen} />
          </div>
          {/* Row 2 */}
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
            <FmtBtn label="B" cls="font-bold" cmd="bold" />
            <FmtBtn label="I" cls="italic" cmd="italic" />
            <FmtBtn label="U" cls="underline" cmd="underline" />
            <FmtBtn label="S" cls="line-through" cmd="strikeThrough" />
            <FmtBtn label="X₂" cmd="subscript" />
            <FmtBtn label="X²" cmd="superscript" />
            <IBtn icon="🖊" title="Tô màu nền" onClick={() => openPopup("back")} active={popup === "back"} />
            <FmtBtn label="Ix" cls="italic" cmd="removeFormat" title="Xóa định dạng" />
            <Sep />
            <FmtBtn label="≡" cmd="insertOrderedList" title="Danh sách có số" />
            <FmtBtn label="≣" cmd="insertUnorderedList" title="Danh sách dấu chấm" />
            <FmtBtn label="⇥" cmd="indent" title="Thụt vào" />
            <FmtBtn label="⇤" cmd="outdent" title="Thụt ra" />
            <Sep />
            <FmtBtn label="❝" cmd="formatBlock" cmdVal="blockquote" title="Trích dẫn" />
            <FmtBtn label="DIV" cmd="formatBlock" cmdVal="div" title="Khối DIV" />
            <Sep />
            <FmtBtn label="⬛" cmd="justifyLeft" title="Căn trái" />
            <FmtBtn label="⬜" cmd="justifyCenter" title="Căn giữa" />
            <FmtBtn label="▪" cmd="justifyRight" title="Căn phải" />
            <FmtBtn label="▫" cmd="justifyFull" title="Căn đều" />
            <Sep />
            <FmtBtn label="‡" cmd="insertHorizontalRule" title="Đường kẻ ngang" />
            <Sep />
            <IBtn icon="🔗" title="Chèn liên kết" onClick={() => openPopup("link")} active={popup === "link"} />
            <FmtBtn label="⛓" cmd="unlink" title="Hủy liên kết" />
            <IBtn icon="⚑" title="Đánh dấu" onClick={() => exec("backColor", "#ffff00")} />
          </div>
          {/* Row 3 */}
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
            <IBtn icon="🖼" title="Chèn ảnh" onClick={() => openPopup("image")} active={popup === "image"} />
            <IBtn icon="▶" title="Chèn video" onClick={() => openPopup("video")} active={popup === "video"} />
            <IBtn icon="⊞" title="Chèn bảng" onClick={() => openPopup("table")} active={popup === "table"} />
            <FmtBtn label="—" cmd="insertHorizontalRule" title="Đường ngang" />
            <Sep />
            <IBtn icon="😊" title="Biểu tượng cảm xúc" onClick={() => openPopup("emoji")} active={popup === "emoji"} />
            <IBtn icon="Ω" title="Ký tự đặc biệt" onClick={() => openPopup("special")} active={popup === "special"} />
            <IBtn icon="⟶" title="Chèn mũi tên" onClick={() => exec("insertText", " → ")} />
            <IBtn icon="🌐" title="Ngôn ngữ" />
            <Sep />
            <select onMouseDown={saveSelection} onChange={(e) => exec("formatBlock", e.target.value)}
              className="h-5 text-[10px] border border-gray-300 rounded px-1 bg-white leading-none cursor-pointer"
              defaultValue="">
              <option value="" disabled>Kiểu</option>
              {HEADING_STYLES.map(([label, val]) => <option key={val} value={val}>{label}</option>)}
            </select>
            <select onMouseDown={saveSelection} onChange={(e) => exec("fontSize", e.target.value)}
              className="h-5 text-[10px] border border-gray-300 rounded px-1 bg-white leading-none w-16 cursor-pointer"
              defaultValue="">
              <option value="" disabled>Cỡ chữ</option>
              {FONT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select onMouseDown={saveSelection} onChange={(e) => exec("fontName", e.target.value)}
              className="h-5 text-[10px] border border-gray-300 rounded px-1 bg-white leading-none cursor-pointer"
              defaultValue="">
              <option value="" disabled>Phông</option>
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <Sep />
            <IBtn icon="A" title="Màu chữ" cls="text-red-600 font-bold" onClick={() => openPopup("fore")} active={popup === "fore"} />
            <IBtn icon="A" title="Màu nền chữ" cls="bg-yellow-200 font-bold" onClick={() => openPopup("back")} active={popup === "back"} />
          </div>
        </div>

        {/* ── Popups (positioned absolute) ── */}
        {popup && (
          <div className="absolute top-[calc(var(--tb-h,120px))] left-0 right-0 z-50 flex justify-start px-3 pointer-events-none">
            <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>

              {/* Color picker */}
              {(popup === "fore" || popup === "back") && (
                <div className="bg-white border border-gray-300 rounded shadow-xl p-2 mt-1">
                  <p className="text-[10px] text-gray-500 mb-1">{popup === "fore" ? "Màu chữ" : "Màu nền"}</p>
                  <div className="grid grid-cols-8 gap-0.5">
                    {COLORS.map((c) => (
                      <button key={c} title={c} style={{ background: c }}
                        className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
                        onClick={() => applyColor(c, popup as "fore" | "back")} />
                    ))}
                  </div>
                  <button onClick={() => { const c = prompt("Nhập mã màu (vd: #ff0000):","#"); if (c) applyColor(c, popup as "fore" | "back"); }}
                    className="mt-1 text-[10px] text-blue-600 hover:underline">Màu tùy chỉnh...</button>
                </div>
              )}

              {/* Emoji picker */}
              {popup === "emoji" && (
                <div className="bg-white border border-gray-300 rounded shadow-xl p-2 mt-1">
                  <p className="text-[10px] text-gray-500 mb-1">Biểu tượng cảm xúc</p>
                  <div className="grid grid-cols-10 gap-0.5">
                    {EMOJIS.map((em) => (
                      <button key={em} title={em}
                        className="w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-100 rounded"
                        onClick={() => insertEmoji(em)}>{em}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Special chars */}
              {popup === "special" && (
                <div className="bg-white border border-gray-300 rounded shadow-xl p-2 mt-1">
                  <p className="text-[10px] text-gray-500 mb-1">Ký tự đặc biệt</p>
                  <div className="grid grid-cols-10 gap-0.5">
                    {SPECIAL_CHARS.map((ch) => (
                      <button key={ch} title={ch}
                        className="w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-100 rounded font-mono"
                        onClick={() => insertSpecial(ch)}>{ch}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Table picker */}
              {popup === "table" && (
                <div className="bg-white border border-gray-300 rounded shadow-xl p-3 mt-1">
                  <p className="text-[10px] text-gray-500 mb-2">Chọn kích thước bảng ({hoverCell[0]+1}×{hoverCell[1]+1})</p>
                  <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(8,1fr)" }}>
                    {Array(8).fill(0).map((_, r) => Array(8).fill(0).map((_, c) => (
                      <button key={`${r}-${c}`}
                        className={`w-5 h-5 border rounded ${r <= hoverCell[0] && c <= hoverCell[1] ? "bg-blue-300 border-blue-500" : "bg-gray-100 border-gray-300"}`}
                        onMouseEnter={() => setHoverCell([r, c])}
                        onClick={() => { setTRows(r + 1); setTCols(c + 1); insertTable(); }}
                      />
                    )))}
                  </div>
                  <div className="flex gap-2 mt-2 items-center">
                    <input type="number" min={1} max={20} value={tRows} onChange={(e) => setTRows(+e.target.value)}
                      className="w-12 border border-gray-300 rounded text-xs px-1 py-0.5" />
                    <span className="text-xs">×</span>
                    <input type="number" min={1} max={20} value={tCols} onChange={(e) => setTCols(+e.target.value)}
                      className="w-12 border border-gray-300 rounded text-xs px-1 py-0.5" />
                    <button onClick={insertTable} className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded hover:bg-blue-700">Chèn</button>
                  </div>
                </div>
              )}

              {/* Link dialog */}
              {popup === "link" && (
                <div className="bg-white border border-gray-300 rounded shadow-xl p-3 mt-1 w-80">
                  <p className="text-[10px] font-semibold text-gray-700 mb-2">Chèn liên kết</p>
                  <input autoFocus value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://..." onKeyDown={(e) => e.key === "Enter" && insertLink()}
                    className="w-full border border-gray-300 rounded text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2" />
                  <div className="flex gap-2 justify-end">
                    <button onClick={closePopup} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1">Hủy</button>
                    <button onClick={insertLink} className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700">Chèn</button>
                  </div>
                </div>
              )}

              {/* Image dialog */}
              {popup === "image" && (
                <div className="bg-white border border-gray-300 rounded shadow-xl p-3 mt-1 w-80">
                  <p className="text-[10px] font-semibold text-gray-700 mb-2">Chèn ảnh</p>
                  <input autoFocus value={imgUrl} onChange={(e) => setImgUrl(e.target.value)}
                    placeholder="URL ảnh..." className="w-full border border-gray-300 rounded text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-1" />
                  <input value={imgAlt} onChange={(e) => setImgAlt(e.target.value)}
                    placeholder="Mô tả ảnh (alt)..." className="w-full border border-gray-300 rounded text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2" />
                  <div className="flex gap-2 justify-end">
                    <button onClick={closePopup} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1">Hủy</button>
                    <button onClick={insertImage} className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700">Chèn</button>
                  </div>
                </div>
              )}

              {/* Video dialog */}
              {popup === "video" && (
                <div className="bg-white border border-gray-300 rounded shadow-xl p-3 mt-1 w-80">
                  <p className="text-[10px] font-semibold text-gray-700 mb-2">Chèn video (YouTube hoặc URL nhúng)</p>
                  <input autoFocus value={vidUrl} onChange={(e) => setVidUrl(e.target.value)}
                    placeholder="https://youtube.com/..." className="w-full border border-gray-300 rounded text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2" />
                  <div className="flex gap-2 justify-end">
                    <button onClick={closePopup} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1">Hủy</button>
                    <button onClick={insertVideo} className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700">Chèn</button>
                  </div>
                </div>
              )}

              {/* HTML modal */}
              {popup === "html" && (
                <div className="bg-white border border-gray-300 rounded shadow-xl p-3 mt-1 w-[500px]">
                  <p className="text-[10px] font-semibold text-gray-700 mb-2">Mã HTML (nội dung bài viết)</p>
                  <AutoTextarea value={htmlView} onChange={(e) => setHtmlView(e.target.value)} minRows={10}
                    className="w-full border border-gray-300 rounded text-[10px] font-mono px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2" />
                  <div className="flex gap-2 justify-end">
                    <button onClick={closePopup} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1">Hủy</button>
                    <button onClick={applyHtml} className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700">Áp dụng</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overlay to close popup when clicking outside */}
        {popup && <div className="fixed inset-0 z-40" onClick={closePopup} />}

        {/* ── Search bar ── */}
        {(showSearch || showReplace) && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-3 py-2 flex flex-col gap-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-14 shrink-0">Tìm:</span>
              <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập từ cần tìm..." onKeyDown={(e) => e.key === "Escape" && setShowSearch(false)}
                className="flex-1 border border-gray-300 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400" />
              <span className="text-xs text-gray-400">
                {search.trim() ? `${filteredGrouped.reduce((s, g) => s + g.rows.length, 0)} kết quả` : ""}
              </span>
              <button onClick={() => { setShowSearch(false); setShowReplace(false); setSearch(""); }}
                className="text-gray-400 hover:text-gray-600 text-sm leading-none">✕</button>
            </div>
            {showReplace && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-14 shrink-0">Thay bằng:</span>
                <input value={replaceFrom} onChange={(e) => setReplaceFrom(e.target.value)} placeholder="Từ cần thay..."
                  className="flex-1 border border-gray-300 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400" />
                <input value={replaceTo} onChange={(e) => setReplaceTo(e.target.value)} placeholder="Thay bằng..."
                  className="flex-1 border border-gray-300 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400" />
                <button onClick={handleReplace} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-0.5 rounded">Thay tất cả</button>
              </div>
            )}
          </div>
        )}

        {/* ── Content area ── */}
        <div ref={contentRef} className="flex-1 overflow-auto bg-white p-3 md:p-4">
          {tieuDe && <p className="text-center font-bold text-xs uppercase mb-1">{tieuDe}</p>}
          {moTa && <p className="text-center text-xs italic text-gray-600 mb-1">{moTa}</p>}

          {/* Rich-text editor area — toolbar commands apply here */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={saveSelection}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            className="min-h-[32px] mb-3 focus:outline-none text-sm text-gray-800 border-b border-dashed border-gray-200 pb-2 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 empty:before:text-xs"
            data-placeholder="Nhập nội dung bài viết ở đây... (chọn văn bản rồi dùng toolbar để định dạng)"
          />

          <div className="overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0">
          <table className="border-collapse" style={{ fontSize: 13 }}>
            <colgroup>
              <col style={{ width: 34 }} /><col style={{ width: 140 }} /><col style={{ width: 166 }} />
              <col style={{ width: 76 }} /><col style={{ width: 58 }} /><col style={{ width: 60 }} />
              <col style={{ width: 60 }} /><col style={{ width: 66 }} /><col style={{ width: 86 }} />
              <col style={{ width: 86 }} /><col style={{ width: 86 }} /><col style={{ width: 86 }} />
              <col style={{ width: 73 }} /><col style={{ width: 86 }} /><col style={{ width: 99 }} />
              <col style={{ width: 86 }} /><col style={{ width: 60 }} /><col style={{ width: 32 }} />
            </colgroup>
            <thead>
              <tr>
                <th rowSpan={4} className={TH}>TT<br /><span className="font-normal text-[9px]">(A)</span></th>
                <th rowSpan={4} className={TH}>Tên Việt Nam<br /><span className="font-normal text-[9px]">(B)</span></th>
                <th rowSpan={4} className={TH}>Tên khoa học<br /><span className="font-normal text-[9px]">(C)</span></th>
                <th rowSpan={4} className={TH}>Dạng mẫu<br />thu thập<br /><span className="font-normal text-[9px]">(1)</span></th>
                <th rowSpan={4} className={TH}>Tư liệu hóa<br /><span className="font-normal text-[9px]">(2)</span></th>
                <th colSpan={2} className={TH}>Đánh giá nguồn gen</th>
                <th colSpan={5} className={TH}>Hiện trạng bảo tồn</th>
                <th colSpan={4} className={TH}>Hiện trạng khai thác, sử dụng</th>
                <th rowSpan={4} className={TH}>Ghi chú<br /><span className="font-normal text-[9px]">(15)</span></th>
                <th rowSpan={4} className={TH}></th>
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
                <th className={TH}>7</th><th className={TH}>8</th><th className={TH}>9</th>
                <th className={TH}>10</th><th className={TH}>11</th><th className={TH}>12</th>
                <th className={TH}>13</th><th className={TH}>14</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrouped.map(({ id, roman, label, rows: sRows, startIndex }) => (
                <GroupRows key={id} roman={roman} label={label} nhomId={id}
                  rows={sRows} startIndex={startIndex}
                  onCellChange={handleCellChange}
                  onDelete={deleteRow} onAdd={addRow}
                  onSaveSelection={saveSelection} />
              ))}
            </tbody>
          </table>
          </div>{/* end overflow-x-auto */}

          <div className="mt-3 space-y-0.5 text-[13px] text-gray-700">
            <p>(*) Phương thức bảo tồn: Bảo tồn tại chỗ (NV); Bảo tồn chuyển chỗ (CV)</p>
            <p>(**) Hình thức bảo tồn: (1) Bảo vệ các sinh cảnh sống tự nhiên của loài; (2) Lưu giữ in-vitro; (3) Lưu giữ trong kho lạnh sâu; (4) Lưu giữ giống trong trang trại, đồng ruộng, vườn hộ; (5) Lưu giữ cây đầu dòng trong nhà lưới; (6) Lưu giữ cây đầu dòng tại địa phương; (7) Lưu giữ cây đầu dòng tại Vườn thực vật; (8) Lưu giữ đông lạnh trong phòng thí nghiệm; (9) Lưu giữ đàn bố mẹ trong trang trại, cơ sở sản xuất giống; (10) Lưu giữ đàn hạt nhân, đàn bố mẹ tại cơ sở bảo tồn; (11) Bảo tồn trong trang trại; (12) Duy trì rừng phòng hộ ven biển</p>
            <p>(***) Hình thức khai thác, sử dụng: (1) Đánh giá chất lượng, phục tráng giống; (2) Tuyển chọn cây đầu dòng, cây mẹ; (3) Xây dựng vườn cây đầu dòng; (4) Xây dựng mô hình sản xuất thử nghiệm; (5) Xây dựng mô hình trồng chuyên canh; (6) Mô hình kinh tế nông hộ; (7) Tuyển chọn giống bố mẹ; (8) Tuyển chọn đàn bố mẹ; (9) Xây dựng mô hình nuôi thử nghiệm; (10) Xây dựng mô hình chăn nuôi tập trung; (11) Mô hình chăn nuôi nông hộ; (12) Xây dựng mô hình chuyên canh; ...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── GroupRows ───────────────────────────────────────────────────────────── */
interface GroupRowsProps {
  roman: string; label: string; nhomId: string;
  rows: BaiVietRow[]; startIndex: number;
  onCellChange: (id: string, col: keyof BaiVietRow, val: string) => void;
  onDelete: (id: string) => void;
  onAdd: (nhom: string) => void;
  onSaveSelection: () => void;
}

function GroupRows({ roman, label, nhomId, rows, startIndex, onCellChange, onDelete, onAdd, onSaveSelection }: GroupRowsProps) {
  const cell = (row: BaiVietRow, col: keyof BaiVietRow, italic = false, center = false) => {
    const val = String(row[col] ?? "");
    return (
      <td
        key={`${row.id}-${col}-${val}`}
        contentEditable
        suppressContentEditableWarning
        className={`${TD}${italic ? " italic" : ""}${center ? " text-center" : ""} focus:outline-none focus:bg-yellow-50 cursor-text`}
        onBlur={(e) => {
          const newVal = (e.currentTarget.innerText ?? "").trim();
          if (newVal !== val) onCellChange(row.id, col, newVal);
        }}
        onMouseUp={onSaveSelection}
        onKeyUp={onSaveSelection}
        dangerouslySetInnerHTML={{ __html: val }}
      />
    );
  };

  return (
    <>
      <tr className="bg-gray-100">
        <td className={`${TD} font-bold text-center`}>{roman}</td>
        <td colSpan={16} className={`${TD} font-bold uppercase`}>{label}</td>
        <td className={`${TD} text-center`}>
          <button onClick={() => onAdd(nhomId)} title="Thêm dòng"
            className="text-green-600 hover:text-green-800 font-bold leading-none">+</button>
        </td>
      </tr>
      {rows.length === 0 ? (
        <tr><td colSpan={18} className={`${TD} text-center text-gray-400 italic py-1`}>Chưa có dữ liệu</td></tr>
      ) : rows.map((row, idx) => (
        <tr key={row.id} className="hover:bg-blue-50 group transition-colors">
          <td className={`${TD} text-center text-gray-500 select-none`}>{startIndex + idx + 1}</td>
          {cell(row, "ten")}
          {cell(row, "khoa_hoc", true)}
          {cell(row, "dang_mau", false, true)}
          {cell(row, "tu_lieu", false, true)}
          {cell(row, "dg_ban_dau", false, true)}
          {cell(row, "dg_chi_tiet", false, true)}
          {cell(row, "chua_bt", false, true)}
          {cell(row, "pt_bt")}
          {cell(row, "ht_bt")}
          {cell(row, "noi_bt")}
          {cell(row, "dv_bt")}
          {cell(row, "chua_kt", false, true)}
          {cell(row, "ht_kt")}
          {cell(row, "dia_diem")}
          {cell(row, "dv_kt")}
          {cell(row, "ghi_chu")}
          <td className={`${TD} text-center`}>
            <button onClick={() => onDelete(row.id)} title="Xóa dòng"
              className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </td>
        </tr>
      ))}
    </>
  );
}

/* ── Toolbar helpers ─────────────────────────────────────────────────────── */
function TBtn({ label, onClick, active }: { label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button onMouseDown={(e) => { e.preventDefault(); onClick?.(); }}
      className={`px-1.5 py-0.5 text-[10px] border rounded leading-none transition-colors
        ${active ? "bg-blue-100 border-blue-400" : "bg-white border-gray-300 hover:bg-gray-100"}`}>
      {label}
    </button>
  );
}

function FmtBtn({ label, cls = "", cmd, cmdVal, title }: {
  label: string; cls?: string; cmd?: string; cmdVal?: string; title?: string;
}) {
  return (
    <button
      title={title ?? cmd ?? label}
      onMouseDown={(e) => { e.preventDefault(); if (cmd) document.execCommand(cmd, false, cmdVal); }}
      className={`w-5 h-5 flex items-center justify-center text-[10px] border border-transparent rounded hover:border-gray-300 hover:bg-gray-100 leading-none ${cls}`}
    >{label}</button>
  );
}

function IBtn({ icon, title, cls = "", onClick, active, disabled }: {
  icon: string; title: string; cls?: string; onClick?: () => void; active?: boolean; disabled?: boolean;
}) {
  return (
    <button title={title} disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); if (!disabled) onClick?.(); }}
      className={`w-5 h-5 flex items-center justify-center text-[10px] rounded leading-none transition-colors
        ${active ? "bg-blue-100 border border-blue-400" : "hover:bg-gray-200"}
        ${disabled ? "opacity-30 cursor-not-allowed" : ""}
        ${cls}`}
    >{icon}</button>
  );
}

function Sep() { return <div className="w-px h-4 bg-gray-300 mx-0.5 shrink-0" />; }
