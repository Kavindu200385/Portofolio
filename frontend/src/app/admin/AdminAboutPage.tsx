import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { usePortfolioData, type AboutData } from "../data/portfolioData";
import { apiUrl } from "../lib/apiBase";
import { uploadImage } from "./lib/uploadImage";
import { uploadDocument } from "./lib/uploadDocument";
import { AdminLayout } from "./AdminLayout";

export function AdminAboutPage() {
  const { data, refetch } = usePortfolioData();
  const [photoUploading, setPhotoUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<AboutData>({
    defaultValues: data.about,
  });

  // `data.about` arrives asynchronously after mount — sync the form once it lands so the
  // editor doesn't show stale/default values that would overwrite real data on save.
  useEffect(() => {
    if (!isDirty) reset(data.about);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.about]);

  const profilePhoto = watch("profilePhoto");
  const resumeLink = watch("resumeLink");
  const badges = watch("badges");

  const onPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("profilePhoto", url, { shouldDirty: true });
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Photo upload failed");
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const onResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeUploading(true);
    try {
      const url = await uploadDocument(file);
      setValue("resumeLink", url, { shouldDirty: true });
      toast.success("Résumé uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Résumé upload failed");
    } finally {
      setResumeUploading(false);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

  const addBadge = () => {
    setValue(
      "badges",
      [...badges, { id: `badge-${Date.now()}`, emoji: "✨", label: "" }],
      { shouldDirty: true },
    );
  };

  const removeBadge = (id: string) => {
    setValue(
      "badges",
      badges.filter((b) => b.id !== id),
      { shouldDirty: true },
    );
  };

  const updateBadge = (id: string, field: "emoji" | "label", value: string) => {
    setValue(
      "badges",
      badges.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
      { shouldDirty: true },
    );
  };

  const onSubmit = async (values: AboutData) => {
    setSaving(true);
    try {
      const res = await fetch(apiUrl("/api/about"), {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Save failed");
      toast.success("About section saved");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "24px", fontWeight: 800, margin: "0 0 24px 0" }}>
        About
      </h1>

      <div style={{ maxWidth: "640px" }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Field label="Name">
            <Input {...register("name")} placeholder="Your full name — shown as the big headline" />
          </Field>
          <Field label="Subtitle / role description">
            <Textarea rows={3} {...register("paragraphs.0")} placeholder="e.g. A final-year Computer Science student…" />
          </Field>
          <Field label="Paragraph 2">
            <Textarea rows={3} {...register("paragraphs.1")} />
          </Field>
          <Field label="Paragraph 3">
            <Textarea rows={3} {...register("paragraphs.2")} />
          </Field>

          <Field label="Pull quote">
            <Textarea rows={2} {...register("pullQuote")} placeholder="A short quote highlighted in its own box" />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Credential title">
              <Input {...register("credentialTitle")} placeholder="BSc Computer Science" />
            </Field>
            <Field label="Credential subtitle">
              <Input {...register("credentialSubtitle")} placeholder="University of Plymouth · NSBM" />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Résumé / CV">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Input {...register("resumeLink")} placeholder="/cv.pdf or https://…" />
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={onResumeChange}
                    disabled={resumeUploading}
                  />
                  {resumeUploading ? (
                    <span style={{ fontSize: "12px", color: "rgba(128,128,128,0.8)" }}>Uploading…</span>
                  ) : resumeLink ? (
                    <a href={resumeLink} target="_blank" rel="noreferrer" style={{ fontSize: "12px" }}>
                      View current
                    </a>
                  ) : null}
                </div>
              </div>
            </Field>
            <Field label="LinkedIn URL">
              <Input {...register("linkedinLink")} placeholder="https://linkedin.com/in/…" />
            </Field>
          </div>

          <Field label="Profile photo">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile preview"
                  style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "10px" }}
                />
              ) : null}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={onPhotoChange}
                disabled={photoUploading}
              />
              {photoUploading ? (
                <span style={{ fontSize: "12px", color: "rgba(128,128,128,0.8)" }}>Uploading…</span>
              ) : null}
            </div>
          </Field>

          <Field label="Badges">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {badges.map((badge) => (
                <div key={badge.id} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Input
                    value={badge.emoji}
                    onChange={(e) => updateBadge(badge.id, "emoji", e.target.value)}
                    style={{ width: "60px" }}
                    placeholder="✨"
                  />
                  <Input
                    value={badge.label}
                    onChange={(e) => updateBadge(badge.id, "label", e.target.value)}
                    placeholder="Badge label"
                    style={{ flex: 1 }}
                  />
                  <Button type="button" variant="ghost" onClick={() => removeBadge(badge.id)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addBadge} style={{ alignSelf: "flex-start" }}>
                Add badge
              </Button>
            </div>
          </Field>

          <Button type="submit" disabled={saving || photoUploading}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
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
