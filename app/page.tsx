"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import { CATEGORIES } from "@/data/nguonGen";
import Sidebar from "@/components/Sidebar";
import LoginModal from "@/components/LoginModal";
import DataTable from "@/components/DataTable";
import EditModal from "@/components/EditModal";
import { nguonGenData, NguonGen } from "@/data/nguonGen";
import { ExtendedFormData } from "@/data/extendedTypes";
import { supabase } from "@/lib/supabase";
import { apiGetAll, apiGetForms, apiCreate, apiUpdate, apiDelete, apiSaveForm, apiSeed } from "@/lib/api";
import ThongKeTable from "@/components/ThongKeTable";
import ThongKeDonViHC from "@/components/ThongKeDonViHC";
import ThongKeNhomNguonGen from "@/components/ThongKeNhomNguonGen";
import NhomNguonGenTable from "@/components/NhomNguonGenTable";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [data, setData] = useState<NguonGen[]>([]);
  const [extendedMap, setExtendedMap] = useState<Record<string, ExtendedFormData>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarEditItem, setSidebarEditItem] = useState<NguonGen | null>(null);
  const [activeTab, setActiveTab] = useState("nguon-gen");
  const [tableCategory, setTableCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [activeStats, setActiveStats] = useState<string | null>(null);
  const [activeDanhMuc, setActiveDanhMuc] = useState<string | null>(null);

  // Load data from backend on mount
  const loadData = useCallback(async () => {
    try {
      const records = await apiGetAll();
      if (records.length === 0) {
        // DB empty — seed with initial data
        setSeeding(true);
        await apiSeed(nguonGenData);
        setData(nguonGenData);
        setSeeding(false);
      } else {
        setData(records);
      }
    } catch (err) {
      console.error("Lỗi load data:", err);
      setData(nguonGenData); // fallback to static
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Supabase Realtime — sync khi người khác thay đổi
  useEffect(() => {
    const channel = supabase
      .channel("nguon_gen_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "nguon_gen" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setData((prev) =>
              prev.map((item) =>
                item.ma === (payload.new as NguonGen).ma ? (payload.new as NguonGen) : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setData((prev) =>
              prev.filter((item) => item.ma !== (payload.old as NguonGen).ma)
            );
          } else if (payload.eventType === "INSERT") {
            setData((prev) => [...prev, payload.new as NguonGen]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of data) map[item.nhom] = (map[item.nhom] ?? 0) + 1;
    return map;
  }, [data]);

  const filteredData = useMemo(() => {
    if (!selectedCategory) return data;
    return data.filter((item) => item.nhom === selectedCategory);
  }, [data, selectedCategory]);

  const handleLogin = () => {
    setIsAdmin(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowTable(false);
  };

  const handleAdminClick = () => {
    if (isAdmin) setShowTable(true);
    else setShowLogin(true);
  };

  const handleEdit = async (updated: NguonGen, ext: ExtendedFormData) => {
    try {
      await apiUpdate(updated.ma, updated);
      await Promise.all([
        apiSaveForm(updated.ma, "form1", ext.form1),
        apiSaveForm(updated.ma, "form2", ext.form2),
        apiSaveForm(updated.ma, "form3", ext.form3),
        apiSaveForm(updated.ma, "form4", ext.form4),
      ]);
      // Optimistic update (Realtime will also sync)
      setData((prev) => prev.map((item) => (item.ma === updated.ma ? updated : item)));
      setExtendedMap((prev) => ({ ...prev, [updated.ma]: ext }));
    } catch (err) {
      console.error("Lỗi lưu:", err);
      alert("Lỗi khi lưu dữ liệu. Vui lòng thử lại.");
    }
  };

  const handleAdd = async (newItem: NguonGen, ext: ExtendedFormData) => {
    try {
      const body = newItem.ma.trim()
        ? newItem
        : { ...newItem, ma: `NG${Date.now()}` };
      const created = await apiCreate(body);
      await Promise.all([
        apiSaveForm(created.ma, "form1", ext.form1),
        apiSaveForm(created.ma, "form2", ext.form2),
        apiSaveForm(created.ma, "form3", ext.form3),
        apiSaveForm(created.ma, "form4", ext.form4),
      ]);
      setData((prev) => [...prev, created]);
      setExtendedMap((prev) => ({ ...prev, [created.ma]: ext }));
    } catch (err) {
      console.error("Lỗi tạo:", err);
      alert("Lỗi khi tạo bản ghi. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (ma: string) => {
    try {
      await apiDelete(ma);
      setData((prev) => prev.filter((item) => item.ma !== ma));
      setExtendedMap((prev) => { const n = { ...prev }; delete n[ma]; return n; });
    } catch (err) {
      console.error("Lỗi xóa:", err);
      alert("Lỗi khi xóa. Vui lòng thử lại.");
    }
  };

  const handleOpenEdit = async (ma: string) => {
    if (!extendedMap[ma]) {
      try {
        const forms = await apiGetForms(ma);
        setExtendedMap((prev) => ({ ...prev, [ma]: forms }));
      } catch {
        // use empty default
      }
    }
  };

  const handleSidebarItemSelect = async (item: NguonGen) => {
    setSidebarOpen(false);
    await handleOpenEdit(item.ma);
    setSidebarEditItem(item);
  };

  if (loading || seeding) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 gap-3">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">
          {seeding ? "Đang khởi tạo dữ liệu lần đầu..." : "Đang tải dữ liệu..."}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Header
        isAdmin={isAdmin}
        showNav={isAdmin && (showTable || !!activeStats || !!activeDanhMuc)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "trang-chu") { setShowTable(false); setActiveStats(null); }
          else if (tab === "thong-ke") { setShowTable(false); }
          else if (tab === "danh-muc") {
            if (isAdmin) { setShowTable(true); setTableCategory("all"); setActiveStats(null); setActiveDanhMuc(null); }
            else setShowLogin(true);
          }
          else if (tab === "nguon-gen") { setActiveStats(null); setShowTable(false); }
        }}
        onAdminClick={handleAdminClick}
        onLogout={handleLogout}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        onOpenAdmin={() => {
          if (isAdmin) { setShowTable(true); setActiveTab("danh-muc"); }
          else setShowLogin(true);
        }}
        onNguonGenCategorySelect={(categoryId) => {
          setTableCategory(categoryId);
          setShowTable(true);
          setActiveTab("nguon-gen");
        }}
        onThongKeSelect={(id) => {
          setActiveStats(id);
          setActiveDanhMuc(null);
          setShowTable(false);
        }}
        onDanhMucSelect={(id) => {
          setActiveDanhMuc(id);
          setActiveStats(null);
          setShowTable(false);
        }}
      />

      <div className="flex flex-1 overflow-hidden pb-nav-safe md:pb-0">
        {activeDanhMuc === "dm-nhom-nguon-gen" ? (
          <NhomNguonGenTable />
        ) : activeStats === "tk-don-vi-quan-ly" ? (
          <ThongKeTable data={data} />
        ) : activeStats === "tk-don-vi-hc" ? (
          <ThongKeDonViHC data={data} />
        ) : activeStats === "tk-nhom" ? (
          <ThongKeNhomNguonGen data={data} />
        ) : showTable && isAdmin ? (
          <DataTable
            data={data}
            extendedMap={extendedMap}
            onEdit={handleEdit}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onOpenEdit={handleOpenEdit}
            onClose={() => { setShowTable(false); setActiveTab("nguon-gen"); }}
            activeCategory={tableCategory}
          />
        ) : (
          <>
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              counts={counts}
              total={data.length}
              items={data}
              extendedMap={extendedMap}
              onItemSelect={handleSidebarItemSelect}
            />
            <main className="flex-1 relative flex flex-col overflow-hidden">
              {/* Mobile category bar */}
              <div className="md:hidden flex items-center gap-2 px-2 py-2 overflow-x-auto shrink-0 bg-white border-b border-gray-200">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    selectedCategory === null
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  🗂️ Tất cả
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      const next = cat.id === selectedCategory ? null : cat.id;
                      setSelectedCategory(next);
                      if (next) setSidebarOpen(true);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                      selectedCategory === cat.id
                        ? "text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
              <MapView
                data={filteredData}
                isAdmin={isAdmin}
                onAddNewAtPoint={(lat, lng) => {
                  const template: NguonGen = { ma: "", ten: "", khoa_hoc: "", don_vi: "", phan_nhom: "", nhom: "TT", lat, lng };
                  setSidebarEditItem(template);
                }}
                onDeleteItem={handleDelete}
                onViewDetail={async (item) => {
                  await handleOpenEdit(item.ma);
                  setSidebarEditItem(item);
                }}
              />
            </main>
          </>
        )}
      </div>

      {sidebarEditItem && (
        <EditModal
          item={sidebarEditItem}
          extended={extendedMap[sidebarEditItem.ma] ?? { form1: {}, form2: {}, form3: {}, form4: {} }}
          onSave={async (updated, ext) => { await handleEdit(updated, ext); setSidebarEditItem(null); }}
          onClose={() => setSidebarEditItem(null)}
        />
      )}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
    </div>
  );
}
