"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import LoginModal from "@/components/LoginModal";
import DataTable from "@/components/DataTable";
import { nguonGenData, NguonGen } from "@/data/nguonGen";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [data, setData] = useState<NguonGen[]>(nguonGenData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of data) {
      map[item.nhom] = (map[item.nhom] ?? 0) + 1;
    }
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
    if (isAdmin) {
      setShowTable(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleEdit = (updated: NguonGen) => {
    setData((prev) => prev.map((item) => (item.ma === updated.ma ? updated : item)));
  };

  const handleDelete = (ma: string) => {
    setData((prev) => prev.filter((item) => item.ma !== ma));
  };

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
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}

      {showTable && isAdmin && (
        <DataTable
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setShowTable(false)}
        />
      )}
    </div>
  );
}
