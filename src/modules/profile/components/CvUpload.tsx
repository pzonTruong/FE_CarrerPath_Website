import { useRef, useState } from 'react';
import { Loader2, FileText, Upload, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { profileApi } from '@/modules/profile/api/profile.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { handlePdfPreview } from '@/shared/lib/utils';

interface CvUploadProps {
  currentCvUrl?: string;
  currentCvName?: string;
  onUploadSuccess: (cvUrl: string, cvName: string) => void;
  onDeleteSuccess: () => void;
}

export const CvUpload = ({
  currentCvUrl,
  currentCvName,
  onUploadSuccess,
  onDeleteSuccess,
}: CvUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('CV file size must be under 10MB.');
      return;
    }

    setUploading(true);
    try {
      const res = await profileApi.uploadCv(file);
      const data = res.data as { cvUrl: string; cvName: string };
      onUploadSuccess(data.cvUrl, data.cvName);
      toast.success('CV uploaded successfully.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to upload CV.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your CV?')) return;

    setDeleting(true);
    try {
      await profileApi.deleteCv();
      onDeleteSuccess();
      toast.success('CV deleted successfully.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to delete CV.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="p-6 border-2 border-foreground bg-card text-card-foreground rounded-[4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.15)] w-full">
      <CardHeader className="p-0 pb-4 border-b border-foreground/10 mb-4">
        <CardTitle className="text-md font-mono font-bold uppercase tracking-wider">Curriculum Vitae (CV)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {currentCvUrl ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border-2 border-foreground rounded-[2px] bg-muted/30">
              <a
                href={currentCvUrl}
                onClick={async (e) => {
                  e.preventDefault();
                  if (currentCvUrl) {
                    await handlePdfPreview(currentCvUrl);
                  }
                }}
                title="Click to view CV"
                className="flex items-center gap-2 font-mono text-sm text-foreground hover:text-primary transition-colors font-bold break-all group w-full"
              >
                <FileText className="size-5 shrink-0 text-muted-foreground group-hover:text-primary" />
                <span className="truncate max-w-[180px] xs:max-w-[220px] md:max-w-[320px] flex-grow">
                  {currentCvName || 'My_CV.pdf'}
                </span>
                <ExternalLink className="size-3 shrink-0 opacity-70 group-hover:opacity-100 ml-auto" />
              </a>
            </div>

            <div className="flex justify-between items-center gap-4">
              <Button
                type="button"
                onClick={handleDelete}
                disabled={deleting || uploading}
                variant="ghost"
                size="sm"
                className="border-2 border-foreground bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-[2px] font-mono text-xs uppercase tracking-wider px-3 py-1.5 flex items-center gap-1 cursor-pointer shrink-0"
              >
                {deleting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                Delete CV
              </Button>

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || deleting}
                size="sm"
                className="font-mono text-xs uppercase tracking-wider border-2 border-foreground rounded-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(250,250,250,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all bg-background text-foreground hover:bg-muted cursor-pointer px-3 py-1.5 flex items-center gap-1 shrink-0"
              >
                {uploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Upload className="size-3.5" />
                )}
                Replace CV
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/30 rounded-[4px] bg-muted/10">
            <FileText className="size-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground font-mono text-center mb-4">No CV uploaded yet. (PDF only, max 10MB)</p>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full font-mono text-xs uppercase tracking-wider border-2 border-foreground rounded-[2px] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2.5px_2.5px_0px_0px_rgba(250,250,250,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer py-2.5"
            >
              {uploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-2" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="size-3.5 mr-2" />
                  Upload CV
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
