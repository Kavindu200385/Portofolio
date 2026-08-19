import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
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
import { usePortfolioData, type ProjectItem, type ProjectType } from "../data/portfolioData";
import { mapProjectFromApi } from "../lib/portfolioMappers";
import { apiUrl } from "../lib/apiBase";
import { uploadImage } from "./lib/uploadImage";
import { AdminLayout } from "./AdminLayout";

type ProjectForm = Omit<ProjectItem, "id">;

const EMPTY_PROJECT: ProjectForm = {
  name: "",
  type: "Individual",
  shortDescription: "",
  longDescription: "",
  thumbnail: "",
  extraImages: [],
  githubLink: "",
  liveDemoLink: "",
  techStack: [],
  featured: false,
};

const PROJECT_TYPES: ProjectType[] = ["Individual", "Group", "Research"];

export function AdminProjectsPage() {
  const { refetch } = usePortfolioData();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [extraUploading, setExtraUploading] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [importingDefaults, setImportingDefaults] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const extraInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch, reset } = useForm<ProjectForm>({
    defaultValues: EMPTY_PROJECT,
  });

  // The admin list must reflect real database rows only — usePortfolioData()'s `data.projects`
  // falls back to bundled placeholder content when the database is empty, and those placeholder
  // rows don't have real Mongo ids, so editing them would fail. Fetch the raw list instead.
  const loadProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch(apiUrl("/api/projects"));
      const json = await res.json().catch(() => []);
      const list = Array.isArray(json) ? json : [];
      setProjects(list.map((d, i) => mapProjectFromApi(d as Record<string, unknown>, i)));
    } catch {
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const onImportDefaults = async () => {
    setImportingDefaults(true);
    try {
      const res = await fetch(apiUrl("/api/admin-import-default-projects"), {
        method: "POST",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Import failed");
      const inserted = json.summary?.inserted ?? 0;
      const failed = json.summary?.failed ?? [];
      if (inserted) {
        toast.success(`Imported ${inserted} demo project(s)`);
      } else if (failed.length === 0) {
        toast.success("All demo projects are already in the database");
      }
      if (failed.length > 0) {
        toast.error(`Skipped ${failed.length} project(s) due to errors: ${failed.map((f: { name: string; error: string }) => `${f.name} (${f.error})`).join("; ")}`);
      }
      await Promise.all([loadProjects(), refetch()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImportingDefaults(false);
    }
  };

  const thumbnail = watch("thumbnail");
  const extraImages = watch("extraImages") ?? [];
  const techStack = watch("techStack");
  const type = watch("type");
  const featured = watch("featured");

  const startEdit = (item: ProjectItem) => {
    setEditingId(item.id);
    reset({
      name: item.name,
      type: item.type,
      shortDescription: item.shortDescription,
      longDescription: item.longDescription,
      thumbnail: item.thumbnail,
      extraImages: item.extraImages ?? [],
      githubLink: item.githubLink,
      liveDemoLink: item.liveDemoLink,
      techStack: item.techStack,
      featured: item.featured,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTechInput("");
    reset(EMPTY_PROJECT);
  };

  const onThumbChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("thumbnail", url, { shouldDirty: true });
      toast.success("Thumbnail uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Thumbnail upload failed");
    } finally {
      setThumbUploading(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    }
  };

  const onExtraChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtraUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("extraImages", [...extraImages, url], { shouldDirty: true });
      toast.success("Image added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setExtraUploading(false);
      if (extraInputRef.current) extraInputRef.current.value = "";
    }
  };

  const removeExtraImage = (url: string) => {
    setValue(
      "extraImages",
      extraImages.filter((u) => u !== url),
      { shouldDirty: true },
    );
  };

  const addTech = () => {
    const t = techInput.trim();
    if (!t || techStack.includes(t)) {
      setTechInput("");
      return;
    }
    setValue("techStack", [...techStack, t], { shouldDirty: true });
    setTechInput("");
  };

  const removeTech = (t: string) => {
    setValue(
      "techStack",
      techStack.filter((x) => x !== t),
      { shouldDirty: true },
    );
  };

  const onSubmit = async (values: ProjectForm) => {
    setSaving(true);
    try {
      const url = editingId ? apiUrl(`/api/projects?id=${editingId}`) : apiUrl("/api/projects");
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Save failed");
      toast.success(editingId ? "Project updated" : "Project added");
      cancelEdit();
      await Promise.all([loadProjects(), refetch()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(apiUrl(`/api/projects?id=${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Delete failed");
      toast.success("Project deleted");
      if (editingId === id) cancelEdit();
      await Promise.all([loadProjects(), refetch()]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", margin: "0 0 24px 0" }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "24px", fontWeight: 800, margin: 0 }}>
          Projects
        </h1>
        <Button type="button" variant="outline" size="sm" onClick={() => void onImportDefaults()} disabled={importingDefaults}>
          {importingDefaults ? "Importing…" : "Import demo projects"}
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead style={{ textAlign: "right" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectsLoading ? (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: "center", color: "rgba(128,128,128,0.8)" }}>
                    Loading…
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: "center", color: "rgba(128,128,128,0.8)" }}>
                    No projects yet.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.featured ? "Yes" : "—"}</TableCell>
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
                              <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes "{item.name}" permanently. This can't be undone.
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
        </div>

        <div style={{ maxWidth: "640px" }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "17px", fontWeight: 700, margin: "0 0 16px 0" }}>
            {editingId ? "Edit project" : "Add project"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Field label="Name">
              <Input {...register("name", { required: true })} />
            </Field>

            <div className="admin-grid-2" style={{ alignItems: "end" }}>
              <Field label="Type">
                <Select value={type} onValueChange={(v) => setValue("type", v as ProjectType, { shouldDirty: true })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", paddingBottom: "8px" }}>
                <Switch checked={featured} onCheckedChange={(v) => setValue("featured", v, { shouldDirty: true })} />
                Featured
              </label>
            </div>

            <Field label="Short description">
              <Textarea rows={2} maxLength={150} {...register("shortDescription")} />
            </Field>

            <Field label="Full description">
              <Textarea rows={4} {...register("longDescription")} />
            </Field>

            <div className="admin-grid-2">
              <Field label="GitHub link">
                <Input {...register("githubLink")} placeholder="https://github.com/…" />
              </Field>
              <Field label="Live demo link">
                <Input {...register("liveDemoLink")} placeholder="https://…" />
              </Field>
            </div>

            <Field label="Tech stack">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    placeholder="e.g. React"
                  />
                  <Button type="button" variant="outline" onClick={addTech}>
                    Add
                  </Button>
                </div>
                {techStack.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {techStack.map((t) => (
                      <span
                        key={t}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 10px",
                          borderRadius: "100px",
                          background: "rgba(79,142,247,0.14)",
                          fontSize: "12px",
                        }}
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTech(t)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Field>

            <Field label="Thumbnail">
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {thumbnail ? (
                  <img src={thumbnail} alt="Thumbnail preview" style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "10px" }} />
                ) : null}
                <input ref={thumbInputRef} type="file" accept="image/*" onChange={onThumbChange} disabled={thumbUploading} />
                {thumbUploading ? <span style={{ fontSize: "12px", color: "rgba(128,128,128,0.8)" }}>Uploading…</span> : null}
              </div>
            </Field>

            <Field label="Extra images">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {extraImages.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {extraImages.map((url) => (
                      <div key={url} style={{ position: "relative" }}>
                        <img src={url} alt="Extra" style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px" }} />
                        <button
                          type="button"
                          onClick={() => removeExtraImage(url)}
                          style={{
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            border: "none",
                            background: "#000",
                            color: "#fff",
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
                <input ref={extraInputRef} type="file" accept="image/*" onChange={onExtraChange} disabled={extraUploading} />
                {extraUploading ? <span style={{ fontSize: "12px", color: "rgba(128,128,128,0.8)" }}>Uploading…</span> : null}
              </div>
            </Field>

            <div style={{ display: "flex", gap: "12px" }}>
              <Button type="submit" disabled={saving || thumbUploading || extraUploading}>
                {saving ? "Saving…" : editingId ? "Save changes" : "Add project"}
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
