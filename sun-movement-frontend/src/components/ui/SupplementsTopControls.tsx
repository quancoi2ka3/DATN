"use client";

import { useState } from "react";
import { SearchBar } from "./search-bar";
import { LayoutGrid, LayoutList } from "lucide-react";

const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "name-asc", label: "Tên: A-Z" },
  { value: "name-desc", label: "Tên: Z-A" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "newest", label: "Mới nhất" },
];

export default function SupplementsTopControls() {
  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortValue, setSortValue] = useState("default");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto">
          <SearchBar
            placeholder="Tìm kiếm sản phẩm..."
            value={searchValue}
            onChange={setSearchValue}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 border-r border-slate-700 pr-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-red-500 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-red-500 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="hidden sm:inline">Sắp xếp theo:</span>
              <select
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg text-white py-2 pl-3 pr-10 cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
