import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  MessageSquareText,
  Trash2,
  Download,
  Plus,
  Minus,
} from "lucide-react";
import jsPDF from "jspdf";
import { utils, writeFile } from "xlsx";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function History() {
  const [history, setHistory] = useState({ summaries: [], qa: [] });
  const [activeTab, setActiveTab] = useState("summaries");
  const [expandedSummaries, setExpandedSummaries] = useState({});
  const { isDark } = useDarkMode();

  const fetchHistory = async () => {
    const user = JSON.parse(localStorage.getItem("user"))?.username;
    if (!user) return;
    try {
      const [summRes, qaRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/summaries/${user}`),
        axios.get(`http://localhost:5000/api/qa/${user}`),
      ]);
      setHistory({
        summaries: summRes.data || [],
        qa: qaRes.data || [],
      });
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    const user = JSON.parse(localStorage.getItem("user"))?.username;
    if (!user) return;
    try {
      await axios.delete(`http://localhost:5000/api/summaries/${user}`);
      await axios.delete(`http://localhost:5000/api/qa/${user}`);
      fetchHistory();
    } catch (err) {
      console.error("Failed to clear history", err);
    }
  };

  const deleteItem = async (type, id) => {
    try {
      await axios.delete(`http://localhost:5000/api/${type}/item/${id}`);
      fetchHistory();
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  const toggleSummary = (id) => {
    setExpandedSummaries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const exportCSV = () => {
    const data = [
      ...history.summaries.map((item) => ({
        Type: "Summary",
        Filename: item.filename,
        Content: item.summary,
        Timestamp: new Date(item.createdAt).toLocaleString(),
      })),
      ...history.qa.map((item) => ({
        Type: "Q&A",
        Filename: item.filename,
        Content: `Q: ${item.question}\nA: ${item.answer}`,
        Timestamp: new Date(item.createdAt).toLocaleString(),
      })),
    ];
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "History");
    writeFile(workbook, "TALQS_History.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    let y = 10;
    history.summaries.forEach((item) => {
      doc.text(
        `Summary - ${item.filename} - ${new Date(item.createdAt).toLocaleString()}`,
        10,
        y
      );
      y += 8;
      const lines = doc.splitTextToSize(item.summary, 180);
      doc.text(lines, 10, y);
      y += lines.length * 6 + 6;
    });
    history.qa.forEach((item) => {
      doc.text(
        `Q&A - ${item.filename} - ${new Date(item.createdAt).toLocaleString()}`,
        10,
        y
      );
      y += 8;
      const lines = doc.splitTextToSize(`Q: ${item.question}\nA: ${item.answer}`, 180);
      doc.text(lines, 10, y);
      y += lines.length * 6 + 6;
    });
    doc.save("TALQS_History.pdf");
  };

  return (
    <div className={`min-h-screen py-10 px-6 transition-all duration-300 ${isDark ? "bg-[#1f1f1f] text-white" : "bg-[#f2f2f2] text-[#222]"}`}>
      <h1 className="text-4xl font-bold text-center mb-10">🕘 History Dashboard</h1>

      {/* Buttons */}
      <div className="flex justify-center gap-4 flex-wrap mb-10">
        <button onClick={clearHistory} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition">
          🗑️ Clear All History
        </button>
        <button onClick={exportCSV} className="bg-[#5c4a3f] hover:bg-[#46352b] text-white font-semibold py-2 px-4 rounded flex items-center gap-2 transition">
          <Download size={18} /> Export CSV
        </button>
        <button onClick={exportPDF} className="bg-[#5c4a3f] hover:bg-[#46352b] text-white font-semibold py-2 px-4 rounded flex items-center gap-2 transition">
          <Download size={18} /> Export PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        {["summaries", "qa"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 font-medium text-lg transition border-b-2 ${
              activeTab === tab
                ? "border-[#5c4a3f] text-[#5c4a3f]"
                : "border-transparent text-gray-500 hover:text-[#5c4a3f]"
            }`}
          >
            {tab === "summaries" ? "📄 Summaries" : "💬 Q&A"}
          </button>
        ))}
      </div>

      {/* Summary List */}
      {activeTab === "summaries" && (
        <div className="grid gap-5">
          {history.summaries.length === 0 ? (
            <p className="text-center text-gray-500">No summaries available.</p>
          ) : (
            history.summaries.map((item) => {
              const isExpanded = expandedSummaries[item._id];
              const shortText = item.summary.split(" ").slice(0, 25).join(" ") + "...";
              return (
                <div
                  key={item._id}
                  className={`rounded-xl p-5 shadow-md border transition ${
                    isDark
                      ? "bg-[#292929] text-white border-[#444]"
                      : "bg-white text-[#333] border-[#ddd]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">
                      📁 <b>{item.filename}</b> — {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleSummary(item._id)}
                        title="Expand/Collapse"
                        className="text-[#5c4a3f] hover:text-[#3e2d26]"
                      >
                        {isExpanded ? <Minus size={18} /> : <Plus size={18} />}
                      </button>
                      <button
                        onClick={() => deleteItem("summaries", item._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <pre className="mt-3 text-sm whitespace-pre-wrap leading-relaxed">
                    {isExpanded ? item.summary : shortText}
                  </pre>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Q&A List */}
      {activeTab === "qa" && (
        <div className="grid gap-5">
          {history.qa.length === 0 ? (
            <p className="text-center text-gray-500">No Q&A available.</p>
          ) : (
            history.qa.map((item) => (
              <div
                key={item._id}
                className={`rounded-xl p-5 shadow-md border transition ${
                  isDark
                    ? "bg-[#292929] text-white border-[#444]"
                    : "bg-white text-[#333] border-[#ddd]"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-md font-medium">
                    <b>Q:</b> {item.question}
                  </p>
                  <button
                    onClick={() => deleteItem("qa", item._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-sm"><b>A:</b> {item.answer}</p>
                <p className="text-xs text-gray-400 mt-2">
                  📁 {item.filename} | {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
