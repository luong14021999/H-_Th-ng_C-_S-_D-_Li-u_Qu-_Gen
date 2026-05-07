"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LoginModal from "@/components/LoginModal";
import DataTable from "@/components/DataTable";
import { nguonGenData, NguonGen } from "@/data/nguonGen";
import { ExtendedFormData } from "@/data/extendedTypes";
import { supabase } from "@/lib/supabase";
import { apiGetAll, apiGetForms, apiUpdate, apiDelete, apiSaveForm, apiSeed } from "@/lib/api";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [data, setData] = useState<NguonGen[]>([]);
  const [extendedMap, setExtendedMap] = useState<Record<string, ExtendedFormData>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

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
    setShowTable(true);
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
        onAdminClick={handleAdminClick}
        onLogout={handleLogout}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          counts={counts}
          total={data.length}
        />

        <main className="flex-1 relative flex flex-col overflow-hidden">
          <MapView data={filteredData} />

          {isAdmin && !showTable && (
            <button
              onClick={() => setShowTable(true)}
              className="absolute top-3 left-3 bg-green-700 hover:bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md transition-colors flex items-center gap-1.5 z-[1000]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
              </svg>
              Quản lý dữ liệu
            </button>
          )}
        </main>
      </div>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}

      {showTable && isAdmin && (
        <DataTable
          data={data}
          extendedMap={extendedMap}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onOpenEdit={handleOpenEdit}
          onClose={() => setShowTable(false)}
        />
      )}
    </div>
  );
}
