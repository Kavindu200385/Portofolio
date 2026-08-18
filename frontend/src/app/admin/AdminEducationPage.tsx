import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { usePortfolioData, type EducationItem } from "../data/portfolioData";
import { mapEducationFromApi } from "../lib/portfolioMappers";
import { apiUrl } from "../lib/apiBase";
import { uploadImage } from "./lib/uploadImage";
import { AdminLayout } from "./AdminLayout";

type EducationForm = Omit<EducationItem, "id" | "side">;

const EMPTY_EDUCATION: EducationForm = {
  institutionName: "",
  degree: "",
  startDate: "",
  endDate: "",
  present: false,
  description: "",
  logo: "",
};

export function AdminEducationPage() {
  const { refetch } = usePortfolioData();
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [educationLoading, setEducationLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch, reset } = useForm<EducationForm>({
    defaultValues: EMPTY_EDUCATION,
  });

  // The admin list must reflect real database rows only — usePortfolioData()'s `data.education`
  // falls back to bundled placeholder content when the database is empty, and those placeholder
  // rows don't have real Mongo ids, so editing them would fail. Fetch the raw list instead.
  const loadEducation = async () => {
    setEducationLoading(true);
    try {
      const res = await fetch(apiUrl("/api/education"));
      const json = await res.json().catch(() => []);
      const list = Array.isArray(json) ? json : [];
      setEducation(list.map((d, i) => mapEducationFromApi(d as Record<string, unknown>, i)));
    } catch {
      setEducation([]);
    } finally {
      setEducationLoading(false);
    }
  };

  useEffect(() => {
    void loadEducation();
  }, []);

  const onImportDefaults = async () => {
    setImporting(true);
    try {
      const res = await fetch(apiUrl("/api/admin-seed-defaults"), {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Import failed");
      const inserted = json.summary?.educationInserted ?? 0;
      toast.success(inserted ? `Imported ${inserted} education entr${inserted === 1 ? "y" : "ies"}` : "Nothing to import");
      await Promise.all([loadEducation(), refetch()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const present = watch("present");
  const logo = watch("logo");

  const startEdit = (item: EducationItem) => {
    setEditingId(item.id);
    reset({
      institutionName: item.institutionName,
      degree: item.degree,
      startDate: item.startDate,
      endDate: item.endDate,
      present: item.present,
      description: item.description,
      logo: item.logo,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset(EMPTY_EDUCATION);
  };

  const onLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("logo", url, { shouldDirty: true });
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Logo upload failed");
    } finally {
      setLogoUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: EducationForm) => {
    setSaving(true);
    try {
      const url = editingId ? apiUrl(`/api/education?id=${editingId}`) : apiUrl("/api/education");
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Save failed");
      toast.success(editingId ? "Education updated" : "Education added");
      cancelEdit();
      await Promise.all([loadEducation(), refetch()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(apiUrl(`/api/education?id=${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Delete failed");
      toast.success("Education deleted");
      if (editingId === id) cancelEdit();
      await Promise.all([loadEducation(), refetch()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "24px", fontWeight: 800, margin: "0 0 24px 0" }}>
        Education
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead style={{ textAlign: "right" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {educationLoading ? (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: "center", color: "rgba(128,128,128,0.8)" }}>
                    Loading…
                  </TableCell>
                </TableRow>
              ) : education.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: "center", padding: "28px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <span style={{ color: "rgba(128,128,128,0.8)" }}>No education entries yet.</span>
                      <Button type="button" variant="outline" size="sm" onClick={() => void onImportDefaults()} disabled={importing}>
                        {importing ? "Importing…" : "Import from site defaults"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                education.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.institutionName}</TableCell>
                    <TableCell>{item.degree}</TableCell>
                    <TableCell>
                      {item.startDate} — {item.present ? "Present" : item.endDate}
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <Button type="button" variant="outline" size="sm" onClick={() => startEdit(item)}>
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive" size="sm" disabled={deletingId === item.id}>
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this education entry?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes "{item.degree} at {item.institutionName}" permanently. This can't be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(item.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div style={{ maxWidth: "640px" }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "17px", fontWeight: 700, margin: "0 0 16px 0" }}>
            {editingId ? "Edit education" : "Add education"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <Field label="Institution">
                <Input {...register("institutionName", { required: true })} />
              </Field>
              <Field label="Degree">
                <Input {...register("degree", { required: true })} />
              </Field>
              <Field label="Start date">
                <Input {...register("startDate")} placeholder="Jan 2022" />
              </Field>
              <Field label="End date">
                <Input {...register("endDate")} placeholder="Dec 2023" disabled={present} />
              </Field>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
              <Checkbox checked={present} onCheckedChange={(v) => setValue("present", Boolean(v), { shouldDirty: true })} />
              Currently studying here
            </label>

            <Field label="Description">
              <Textarea rows={3} {...register("description")} />
            </Field>

            <Field label="Institution logo">
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {logo ? (
                  <img src={logo} alt="Logo preview" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px" }} />
                ) : null}
                <input ref={logoInputRef} type="file" accept="image/*" onChange={onLogoChange} disabled={logoUploading} />
                {logoUploading ? <span style={{ fontSize: "12px", color: "rgba(128,128,128,0.8)" }}>Uploading…</span> : null}
              </div>
            </Field>

            <div style={{ display: "flex", gap: "12px" }}>
              <Button type="submit" disabled={saving || logoUploading}>
                {saving ? "Saving…" : editingId ? "Save changes" : "Add education"}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
