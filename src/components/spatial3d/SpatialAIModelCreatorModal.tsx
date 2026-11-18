import React, { useRef, useState } from 'react';
import {
  Box,
  CheckCircle2,
  FileText,
  ImagePlus,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  X
} from 'lucide-react';
import {
  compressImageFileForAI,
  readAttachmentFileText,
  requestAIGeneratedSpatialModel
} from './customModelStore';
import { CustomSpatialModel } from './customModelTypes';

interface SpatialAIModelCreatorModalProps {
  isOpen: boolean;
  isEn: boolean;
  onClose: () => void;
  onCreated: (model: CustomSpatialModel) => void;
}

const IDEA_PRESETS = [
  {
    vi: 'Tên lửa đẩy 3 tầng Falcon có buồng đốt, 4 vây ổn định & khoang tải',
    en: '3-stage Falcon rocket with combustion nozzles, grid fins & payload fairing'
  },
  {
    vi: 'Trái tim người 4 ngăn với động mạch chủ, tĩnh mạch & van tim đập theo nhịp',
    en: 'Human heart with 4 chambers, aorta, veins & rhythmic pulsing valves'
  },
  {
    vi: 'Kính viễn vọng không gian James Webb với 7 gương lục giác vàng & tấm chắn nhiệt',
    en: 'James Webb Space Telescope with golden hexagonal mirror array & sunshield'
  },
  {
    vi: 'Lò phản ứng nhiệt hạch Tokamak với vòng từ trường Plasma phát sáng',
    en: 'Tokamak nuclear fusion reactor with glowing toroidal plasma confinement rings'
  }
];

export const SpatialAIModelCreatorModal: React.FC<SpatialAIModelCreatorModalProps> = ({
  isOpen,
  isEn,
  onClose,
  onCreated
}) => {
  const [ideaText, setIdeaText] = useState<string>('');
  const [imageData, setImageData] = useState<{
    base64: string;
    mimeType: string;
    previewUrl: string;
    name: string;
  } | null>(null);
  const [docAttachment, setDocAttachment] = useState<{
    name: string;
    text: string;
    sizeKb: number;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewModel, setPreviewModel] = useState<CustomSpatialModel | null>(null);

  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    try {
      const compressed = await compressImageFileForAI(file);
      setImageData({ ...compressed, name: file.name });
    } catch (err: any) {
      setErrorMsg(err?.message || (isEn ? 'Failed to process image.' : 'Không xử lý được ảnh.'));
    } finally {
      e.target.value = '';
    }
  };

  const handleDocSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    if (file.type.startsWith('image/')) {
      try {
        const compressed = await compressImageFileForAI(file);
        setImageData({ ...compressed, name: file.name });
      } catch (err: any) {
        setErrorMsg(err?.message || 'Lỗi đọc ảnh.');
      }
      e.target.value = '';
      return;
    }
    try {
      const text = await readAttachmentFileText(file);
      setDocAttachment({
        name: file.name,
        text,
        sizeKb: Math.max(1, Math.round(file.size / 1024))
      });
    } catch (err: any) {
      setErrorMsg(err?.message || (isEn ? 'Failed to read file.' : 'Không đọc được tệp đính kèm.'));
    } finally {
      e.target.value = '';
    }
  };

  const handleGenerate = async () => {
    const trimmed = ideaText.trim();
    if (!trimmed && !imageData && !docAttachment) {
      setErrorMsg(
        isEn
          ? 'Please type an idea, upload a sketch/photo, or attach a file.'
          : 'Vui lòng nhập ý tưởng, tải hình ảnh minh họa hoặc đính kèm tệp thiết kế.'
      );
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);
    setPreviewModel(null);

    try {
      const model = await requestAIGeneratedSpatialModel({
        ideaText: trimmed || (imageData ? `Thiết kế mô hình 3D từ hình ảnh "${imageData.name}"` : `Thiết kế mô hình từ tệp "${docAttachment?.name}"`),
        imageBase64: imageData?.base64,
        imageMimeType: imageData?.mimeType,
        attachmentText: docAttachment?.text,
        fileName: docAttachment?.name || imageData?.name,
        language: isEn ? 'en' : 'vi'
      });
      setPreviewModel(model);
    } catch (err: any) {
      setErrorMsg(err?.message || (isEn ? 'AI synthesis failed.' : 'Không thể tạo mô hình lúc này.'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmLaunch = () => {
    if (!previewModel) return;
    onCreated(previewModel);
    setIdeaText('');
    setImageData(null);
    setDocAttachment(null);
    setPreviewModel(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85"
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Syn AI Custom 3D Model Creator' : 'Tạo Mô Hình 3D Sáng Tạo Tự Do Bằng AI'}
    >
      <div data-modal-shell="true" className="spatial-holo-card spatial-step-reveal w-full max-w-3xl shadow-2xl">
        <div className="spatial-holo-ring" />
        <div className="relative z-10 rounded-[9px] bg-[#060c1b] border border-sky-500/40 overflow-hidden">
          <div className="spatial-laser-sweep" />

          {/* Header */}
          <div className="flex items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-400/50 flex items-center justify-center text-sky-300 shrink-0">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Syn AI · Free Creation Lab' : 'Syn AI · Xưởng Sáng Tạo Tự Do'}</span>
                </div>
                <h2 className="text-base sm:text-xl font-extrabold text-white mt-0.5">
                  {isEn
                    ? 'Build Custom 3D Model from Idea, Image or File'
                    : 'Đưa Ý Tưởng / Hình Ảnh / File → AI Tạo Mô Hình 3D Đầy Đủ Tính Năng'}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md bg-slate-900 border border-slate-700 hover:border-sky-400 text-slate-300 hover:text-white cursor-pointer shrink-0"
              aria-label={isEn ? 'Close' : 'Đóng'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 max-h-[68vh] overflow-y-auto space-y-4">
            {/* Quick Idea Chips */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isEn ? 'Quick Inspiration Ideas' : 'Gợi ý ý tưởng nhanh'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {IDEA_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setIdeaText(isEn ? preset.en : preset.vi)}
                    className="spatial-soft-frame spatial-soft-frame-purple text-left px-3 py-2 rounded-md bg-slate-900/90 border border-slate-800 hover:border-sky-400/60 text-[11px] text-slate-200 hover:text-white transition-colors cursor-pointer"
                  >
                    + {isEn ? preset.en : preset.vi}
                  </button>
                ))}
              </div>
            </div>

            {/* Idea Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-200">
                {isEn ? '1. Describe your 3D model idea' : '1. Mô tả ý tưởng mô hình muốn AI thiết kế'}
              </label>
              <textarea
                rows={3}
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                placeholder={
                  isEn
                    ? 'E.g. Twin-rotor drone with carbon frame, battery pack, lidar dome & spinning propellers...'
                    : 'Ví dụ: Máy bay không người lái 4 cánh quạt, có khung carbon, pin trung tâm, cảm biến Lidar quay và chân đáp...'
                }
                className="w-full rounded-lg bg-slate-950 border border-slate-700 focus:border-sky-400 focus:outline-none px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500"
              />
            </div>

            {/* Multimodal Attachments: Image + File */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Image Upload */}
              <div className="spatial-soft-frame rounded-lg bg-slate-900/80 border border-slate-700/80 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <ImagePlus className="w-4 h-4" />
                    {isEn ? 'Upload Sketch / Photo' : 'Tải Hình Ảnh Tham Khảo'}
                  </span>
                  {imageData && (
                    <button
                      type="button"
                      onClick={() => setImageData(null)}
                      className="text-rose-300 hover:text-rose-200 cursor-pointer"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <input
                  ref={imgInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {imageData ? (
                  <div className="flex items-center gap-2.5">
                    <img
                      src={imageData.previewUrl}
                      alt={imageData.name}
                      className="w-14 h-14 rounded-md object-cover border border-cyan-500/40 shrink-0"
                    />
                    <div className="min-w-0 text-[11px] text-slate-200">
                      <div className="font-bold truncate">{imageData.name}</div>
                      <div className="text-emerald-300">
                        {isEn ? 'Ready for AI vision analysis' : 'Đã sẵn sàng cho AI phân tích hình'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imgInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-md border border-dashed border-slate-600 hover:border-cyan-400 text-[11px] font-bold text-slate-300 hover:text-cyan-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Choose PNG / JPG / WebP' : 'Chọn ảnh phác thảo hoặc vật thật'}</span>
                  </button>
                )}
              </div>

              {/* Document / Spec File Upload */}
              <div className="spatial-soft-frame spatial-soft-frame-emerald rounded-lg bg-slate-900/80 border border-slate-700/80 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    {isEn ? 'Upload Blueprint / Spec File' : 'Tải Tệp Tài Liệu / Thông Số'}
                  </span>
                  {docAttachment && (
                    <button
                      type="button"
                      onClick={() => setDocAttachment(null)}
                      className="text-rose-300 hover:text-rose-200 cursor-pointer"
                      title="Xóa tệp"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <input
                  ref={docInputRef}
                  type="file"
                  accept=".txt,.md,.json,.csv,.pdf,.doc,.docx,text/*"
                  onChange={handleDocSelect}
                  className="hidden"
                />

                {docAttachment ? (
                  <div className="rounded-md bg-slate-950 border border-emerald-500/40 px-3 py-2 text-[11px]">
                    <div className="font-bold text-white truncate">{docAttachment.name}</div>
                    <div className="text-emerald-300">
                      {docAttachment.sizeKb} KB · {isEn ? 'Extracted text context' : 'Đã trích xuất nội dung cho AI'}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-md border border-dashed border-slate-600 hover:border-emerald-400 text-[11px] font-bold text-slate-300 hover:text-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Choose TXT / MD / JSON / PDF' : 'Chọn tệp TXT, MD, JSON, CSV, PDF'}</span>
                  </button>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-rose-950/70 border border-rose-500/50 px-3.5 py-2.5 text-xs text-rose-200">
                {errorMsg}
              </div>
            )}

            {/* Generated Model Preview Card */}
            {previewModel && (
              <div className="spatial-soft-frame spatial-soft-frame-emerald spatial-step-reveal rounded-lg bg-emerald-950/35 border border-emerald-400/55 p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isEn
                        ? 'Model Synthesized & Saved to "Sáng tạo tự do"!'
                        : 'Đã tạo xong & lưu vào mục "Sáng tạo tự do"!'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-emerald-500/40 font-mono text-[10px] font-bold text-cyan-300">
                    {previewModel.parts.length} {isEn ? 'Interactive Parts' : 'Bộ phận tách rời'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {isEn ? previewModel.titleEn : previewModel.titleVi}
                  </h3>
                  <div className="text-[11px] font-mono text-sky-300 mt-0.5">{previewModel.formula}</div>
                  <p className="text-xs text-slate-300 mt-1">
                    {isEn ? previewModel.descEn : previewModel.descVi}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {previewModel.parts.map((pt, i) => (
                    <div
                      key={pt.id || i}
                      className="spatial-soft-frame rounded bg-slate-950/90 border border-slate-800 px-2.5 py-1.5 text-[11px]"
                    >
                      <div className="font-mono text-[9px] text-amber-300 uppercase">
                        {isEn ? pt.badgeEn : pt.badgeVi}
                      </div>
                      <div className="font-bold text-slate-100 truncate">
                        {isEn ? pt.nameEn : pt.nameVi}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3.5 border-t border-slate-800 bg-slate-950/95 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              {isEn
                ? 'Includes full 3D features: 2-hand explode, 2-finger inspect, 4-finger reassemble, slice & .OBJ export.'
                : 'Hỗ trợ đầy đủ: tách 2 tay, xem riêng 2 ngón, ghép 4 ngón, mặt cắt, chất liệu & xuất .OBJ.'}
            </span>

            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-200 cursor-pointer"
              >
                {isEn ? 'Close' : 'Đóng'}
              </button>

              {previewModel ? (
                <button
                  type="button"
                  onClick={handleConfirmLaunch}
                  className="cs-deck-btn flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 border border-emerald-300 text-xs font-extrabold text-slate-950 cursor-pointer"
                >
                  <Box className="w-4 h-4" />
                  <span>{isEn ? 'Open Model in 3D Now' : 'Mở Trong Không Gian 3D Ngay'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="cs-deck-btn flex items-center gap-1.5 px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 disabled:opacity-60 border border-sky-300 text-xs font-extrabold text-slate-950 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isEn ? 'Synthesizing 3D Parts...' : 'Syn AI đang dựng mô hình...'}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>{isEn ? 'Generate 3D Model' : 'AI Tạo Mô Hình Ngay'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
