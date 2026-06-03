"use client";
import { CheckCircle, Download, Loader2, ListChecks, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

const STEPS = [
  { n: 1, label: "Download Template", desc: "Get the Excel file with the correct column format." },
  { n: 2, label: "Fill Your Officers", desc: "Add all your officers' details below the sample rows." },
  { n: 3, label: "Upload the File", desc: "Click 'Upload Excel' and select your filled file." },
];

export default function ExcelUploadPage() {
  const [result, setResult] = useState<{ imported: number; skipped_no_belt: number; skipped_duplicate: number; total: number } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function upload(file?: File) {
    if (!file) return;
    setResult(null); setError(""); setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.uploadOfficers(form);
      setResult(res);
    } catch (err) { setError(`Upload failed: ${err}`); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <Card>
        <CardHeader><CardTitle>How to Import Officers</CardTitle></CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {STEPS.map(({ n, label, desc }) => (
              <li key={n} className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-sm font-bold flex items-center justify-center">{n}</span>
                <div><div className="font-medium text-stone-800 text-sm">{label}</div><div className="text-xs text-stone-500 mt-0.5">{desc}</div></div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Upload File</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <a href="/api/officers/template">
              <Button type="button" variant="secondary"><Download className="h-4 w-4" /> Download Template</Button>
            </a>
            <label className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-medium text-white transition-colors ${loading ? "bg-orange-400 pointer-events-none" : "bg-orange-600 hover:bg-orange-700"}`}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {loading ? "Importing..." : "Upload Excel"}
              <input className="hidden" type="file" accept=".xlsx,.xls,.csv" disabled={loading} onChange={(e) => upload(e.target.files?.[0])} />
            </label>
          </div>
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {result && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 space-y-3">
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <CheckCircle className="h-5 w-5 text-green-500" /> Upload successful — {result.imported} officer{result.imported !== 1 ? "s" : ""} imported.
              </div>
              {result.total > 0 && (
                <div className="text-xs text-stone-500 space-y-0.5">
                  <div>Total rows in file: {result.total}</div>
                  {result.skipped_no_belt > 0 && <div className="text-amber-600">{result.skipped_no_belt} row{result.skipped_no_belt !== 1 ? "s" : ""} skipped (missing belt number / employee ID)</div>}
                  {result.skipped_duplicate > 0 && <div className="text-amber-600">{result.skipped_duplicate} duplicate row{result.skipped_duplicate !== 1 ? "s" : ""} skipped (already exists)</div>}
                </div>
              )}
              <Button variant="primary" onClick={() => window.location.hash = "/officers"}><ListChecks className="h-4 w-4" /> View Officers</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
