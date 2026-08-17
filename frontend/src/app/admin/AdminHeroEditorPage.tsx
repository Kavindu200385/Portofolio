import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { usePortfolioData, type HeroData } from "../data/portfolioData";
import { apiUrl } from "../lib/apiBase";
import { uploadHeroVideo } from "./lib/uploadHeroVideo";
import { useAdminAuth } from "./AdminAuthContext";

export function AdminHeroEditorPage() {
  const { data, refetch } = usePortfolioData();
  const { email, logout } = useAdminAuth();
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<HeroData>({ defaultValues: data.hero });

  const heroVideo = watch("heroVideo");

  const onVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    setVideoProgress(0);
    try {
      const url = await uploadHeroVideo(file, setVideoProgress);
      setValue("heroVideo", url, { shouldDirty: true });
      toast.success("Video uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Video upload failed");
    } finally {
      setVideoUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const clearVideo = () => setValue("heroVideo", "", { shouldDirty: true });

  const onSubmit = async (values: HeroData) => {
    setSaving(true);
    try {
      const res = await fetch(apiUrl("/api/hero"), {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Save failed");
      toast.success("Hero section saved");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px 80px",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "24px", fontWeight: 800, margin: 0 }}>
              Hero
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "4px 0 0 0" }}>
              Signed in as {email}
            </p>
          </div>
          <Button variant="outline" onClick={() => void logout()}>
            Log out
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Field label="Heading">
            <Textarea rows={2} {...register("heading")} />
          </Field>

          <Field label="Sub-heading">
            <Textarea rows={2} {...register("subHeading")} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="CTA 1 label">
              <Input {...register("cta1Label")} />
            </Field>
            <Field label="CTA 1 link">
              <Input {...register("cta1Link")} placeholder="#works" />
            </Field>
            <Field label="CTA 2 label">
              <Input {...register("cta2Label")} />
            </Field>
            <Field label="CTA 2 link">
              <Input {...register("cta2Link")} placeholder="#about" />
            </Field>
          </div>

          <Field label="Hero background video">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {heroVideo ? (
                <video
                  src={heroVideo}
                  muted
                  loop
                  autoPlay
                  playsInline
                  style={{ width: "220px", height: "130px", objectFit: "cover", borderRadius: "10px" }}
                />
              ) : (
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>No video set.</span>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={onVideoChange}
                  disabled={videoUploading}
                />
                {heroVideo ? (
                  <Button type="button" variant="ghost" onClick={clearVideo} disabled={videoUploading}>
                    Remove video
                  </Button>
                ) : null}
              </div>
              {videoUploading ? <Progress value={videoProgress} /> : null}
            </div>
          </Field>

          <Button type="submit" disabled={saving || videoUploading}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
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
