import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Box,
  Camera,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Scan,
  Sparkles,
  SwitchCamera,
  Upload,
  X
} from 'lucide-react';
import { CustomSpatialModel } from './customModelTypes';
import { compressImageFileForAI, requestAIGeneratedSpatialModel } from './customModelStore';

interface SpatialRealWorldScannerModalProps {
  isOpen: boolean;
  isEn: boolean;
  onClose: () => void;
  onCreated: (model: CustomSpatialModel) => void;
}

export const SpatialRealWorldScannerModal: React.FC<SpatialRealWorldScannerModalProps> = ({
  isOpen,
  isEn,
  onClose,
  onCreated
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [camActive, setCamActive] = useState(false);
  const [camLoading, setCamLoading] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);

  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [capturedBase64, setCapturedBase64] = useState<string>('');
  const [capturedMime, setCapturedMime] = useState<string>('image/jpeg');
  const [objectHint, setObjectHint] = useState<string>('');

  const [isScanningAI, setIsScanningAI] = useState(false);
  const [scanStageIdx, setScanStageIdx] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generatedModel, setGeneratedModel] = useState<CustomSpatialModel | null>(null);

  const stopScannerCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCamActive(false);
    setCamLoading(false);
  }, []);

  const startScannerCamera = useCallback(
    async (mode: 'environment' | 'user') => {
      setCamError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCamError(
          isEn
            ? 'Camera API is unavailable on this browser. Please upload a photo of the object below.'
            : 'Trình duyệt không hỗ trợ Camera trực tiếp. Bạn có thể chọn/chụp ảnh đồ vật từ nút Tải Ảnh bên dưới.'
        );
        return;
      }

      stopScannerCamera();
      setCamLoading(true);
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: mode },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          });
        } catch (err) {
          const name = err instanceof Error ? err.name : '';
          if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
            throw err;
          }
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

        streamRef.current = stream;
        setCamActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        const name = err instanceof Error ? err.name : '';
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setCamError(
            isEn
              ? 'Camera permission denied. Allow camera access or upload an object photo below.'
              : 'Quyền truy cập Camera bị từ chối. Hãy cấp quyền Camera hoặc dùng nút Tải Ảnh Vật Thể bên dưới.'
          );
        } else {
          setCamError(
            isEn
              ? 'No active camera found. You can still upload a real-world object photo below.'
              : 'Không tìm thấy camera khả dụng trên thiết bị. Bạn vẫn có thể tải ảnh đồ vật thực tế lên để dựng 3D!'
          );
        }
      } finally {
        setCamLoading(false);
      }
    },
    [isEn, stopScannerCamera]
  );

  // Sync video element when stream attaches
  useEffect(() => {
    if (!camActive || !streamRef.current || !videoRef.current) return;
    if (videoRef.current.srcObject !== streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
    videoRef.current.play().catch(() => {});
  }, [camActive, capturedPreview]);

  // Lifecycle when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCapturedPreview(null);
      setCapturedBase64('');
      setObjectHint('');
      setAiError(null);
      setGeneratedModel(null);
      void startScannerCamera(facingMode);
    } else {
      stopScannerCamera();
    }
    return () => {
      stopScannerCamera();
    };
  }, [isOpen]);

  // Animated scanning stages
  useEffect(() => {
    if (!isScanningAI) {
      setScanStageIdx(0);
      return;
    }
    const timer = window.setInterval(() => {
      setScanStageIdx((prev) => (prev + 1) % 3);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isScanningAI]);

  if (!isOpen) return null;

  const handleToggleCameraFacing = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    void startScannerCamera(next);
  };

  const handleCaptureFrame = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setCamError(
        isEn ? 'Camera frame not ready yet. Please wait 1 second.' : 'Khung hình camera đang khởi động, vui lòng đợi 1 giây.'
      );
      return;
    }
    const maxSide = 960;
    let w = video.videoWidth;
    let h = video.videoHeight;
    if (w > maxSide || h > maxSide) {
      const ratio = Math.min(maxSide / w, maxSide / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    const base64 = dataUrl.split(',')[1] || '';
    setCapturedPreview(dataUrl);
    setCapturedBase64(base64);
    setCapturedMime('image/jpeg');
    setAiError(null);
    setGeneratedModel(null);
    stopScannerCamera();
  };

  const handleUploadObjectPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const compressed = await compressImageFileForAI(file);
      stopScannerCamera();
      setCapturedPreview(compressed.previewUrl);
      setCapturedBase64(compressed.base64);
      setCapturedMime(compressed.mimeType);
      setAiError(null);
      setGeneratedModel(null);
    } catch (err: any) {
      setCamError(err?.message || (isEn ? 'Failed to read photo.' : 'Không đọc được ảnh đã chọn.'));
    }
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    setCapturedBase64('');
    setGeneratedModel(null);
    setAiError(null);
    void startScannerCamera(facingMode);
  };

  const handleReconstruct3D = async () => {
    if (!capturedBase64) return;
    setAiError(null);
    setIsScanningAI(true);
    try {
      const model = await requestAIGeneratedSpatialModel({
        ideaText: objectHint.trim(),
        imageBase64: capturedBase64,
        imageMimeType: capturedMime,
        language: isEn ? 'en' : 'vi',
        scanMode: 'real_world_camera'
      });
      setGeneratedModel(model);
    } catch (err: any) {
      setAiError(
        err?.message ||
          (isEn
            ? 'Could not reconstruct 3D model from photo. Please retry with clearer lighting.'
            : 'Không thể dựng mô hình 3D từ ảnh quét. Hãy thử chụp rõ và đủ sáng hơn.')
      );
    } finally {
      setIsScanningAI(false);
    }
  };

  const scanStages = isEn
    ? [
        'Identifying physical object & real-world proportions...',
        'Decomposing structural components & STEM physics...',
        'Compiling interactive Three.js PBR 3D assembly...'
      ]
    : [
        'Đang nhận diện đồ vật thực tế & tỷ lệ không gian...',
        'Đang phân tách các bộ phận & thông số vật lý/hình học...',
        'Đang dựng mô hình 3D tương tác & trục tách cấu trúc...'
      ];

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/90 p-3 sm:p-5 overflow-y-auto">
      <div data-modal-shell="true" className="spatial-holo-card spatial-step-reveal w-full max-w-2xl shadow-2xl my-auto">
        <div className="spatial-holo-ring" />
        <div className="relative z-10 w-full rounded-[9px] border border-cyan-500/45 bg-[#070c1b] text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                {isEn
                  ? 'Real-World Space Learning · Scan Object to 3D'
                  : 'Học Qua Không Gian Thực Tế · Quét Đồ Vật Thành 3D'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEn
                  ? 'Scan any surrounding object with your camera to reconstruct an interactive 3D model'
                  : 'Dùng camera quét đồ vật xung quanh để tạo mô hình 3D tách lớp, xoay 360° & phân tích STEM'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopScannerCamera();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-rose-400 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {!capturedPreview ? (
            <>
              {/* Live AR Viewfinder */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-cyan-500/40 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${camActive ? 'block' : 'hidden'}`}
                />

                {camActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Corner Scanner Brackets */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-md" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-md" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-md" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-md" />
                    {/* Center reticle */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-cyan-400/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    </div>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/85 border border-cyan-500/40 text-[11px] font-mono text-cyan-200 whitespace-nowrap">
                      {isEn ? 'Center object clearly in frame' : 'Đưa đồ vật vào giữa khung ngắm & đủ sáng'}
                    </div>
                  </div>
                )}

                {!camActive && (
                  <div className="p-6 text-center space-y-3 max-w-sm">
                    {camLoading ? (
                      <div className="flex flex-col items-center gap-2 text-cyan-300">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-xs font-bold">
                          {isEn ? 'Initializing camera scanner...' : 'Đang khởi động camera quét vật thể...'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2.5">
                        <Camera className="w-9 h-9 text-slate-500" />
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {camError ||
                            (isEn
                              ? 'Camera preview paused. Start camera or upload a photo of any object.'
                              : 'Camera chưa hoạt động. Bạn có thể bật lại camera hoặc tải ảnh đồ vật trực tiếp.')}
                        </p>
                        <button
                          type="button"
                          onClick={() => void startScannerCamera(facingMode)}
                          className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold cursor-pointer"
                        >
                          {isEn ? 'Retry Camera' : 'Thử Bật Lại Camera'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleCameraFacing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-slate-200 cursor-pointer"
                  >
                    <SwitchCamera className="w-4 h-4 text-cyan-300" />
                    <span>{facingMode === 'environment' ? (isEn ? 'Rear Cam' : 'Cam Sau') : isEn ? 'Front Cam' : 'Cam Trước'}</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleUploadObjectPhoto}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-400 text-xs font-bold text-purple-200 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isEn ? 'Upload / Snap Photo' : 'Tải Ảnh Đồ Vật'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!camActive}
                  onClick={handleCaptureFrame}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-extrabold cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Scan className="w-4 h-4" />
                  <span>{isEn ? 'Capture & Scan Object' : 'Chụp & Quét Vật Thể'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {/* Captured Photo + Hint + Result */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                <div className="sm:col-span-5 relative rounded-xl overflow-hidden border border-cyan-500/40 bg-slate-950 aspect-square sm:aspect-[4/3]">
                  <img
                    src={capturedPreview}
                    alt="Scanned real-world object"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    disabled={isScanningAI}
                    onClick={handleRetake}
                    className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/90 border border-slate-600 text-[11px] font-bold text-white hover:border-cyan-400 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{isEn ? 'Retake' : 'Chụp lại'}</span>
                  </button>
                </div>

                <div className="sm:col-span-7 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {isEn ? 'Optional Object Name / Context Hint' : 'Gợi ý tên đồ vật (không bắt buộc)'}
                    </label>
                    <input
                      type="text"
                      value={objectHint}
                      onChange={(e) => setObjectHint(e.target.value)}
                      disabled={isScanningAI}
                      placeholder={
                        isEn
                          ? 'e.g., Ceramic coffee mug, Desk fan, Mechanical watch...'
                          : 'VD: Cốc giữ nhiệt, Quạt để bàn, Tai nghe, Đồng hồ cơ...'
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {isScanningAI && (
                    <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-300">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isEn ? 'Reconstructing 3D Spatial Model...' : 'Đang Dựng Mô Hình 3D Thực Tế...'}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{scanStages[scanStageIdx]}</p>
                    </div>
                  )}

                  {aiError && (
                    <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{aiError}</span>
                    </div>
                  )}

                  {!generatedModel ? (
                    <button
                      type="button"
                      disabled={isScanningAI}
                      onClick={handleReconstruct3D}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50 text-slate-950 text-xs font-extrabold cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {isScanningAI
                          ? isEn ? 'Analyzing & Building 3D...' : 'Đang Phân Tích & Tạo 3D...'
                          : isEn ? 'Upload & Generate 3D Simulation' : 'Tải Lên & Tạo Mô Phỏng 3D'}
                      </span>
                    </button>
                  ) : (
                    <div className="spatial-soft-frame spatial-soft-frame-emerald p-3.5 rounded-xl bg-emerald-950/35 border border-emerald-500/45 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>
                          {isEn
                            ? `Detected: ${generatedModel.detectedObjectEn || generatedModel.titleEn}`
                            : `Đã nhận diện: ${generatedModel.detectedObjectVi || generatedModel.titleVi}`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 leading-relaxed">
                        {isEn ? generatedModel.descEn : generatedModel.descVi}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-cyan-300">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                          {generatedModel.parts.length} {isEn ? '3D parts' : 'bộ phận 3D'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                          {generatedModel.formula}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onCreated(generatedModel)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold cursor-pointer"
                      >
                        <Box className="w-4 h-4" />
                        <span>
                          {isEn
                            ? 'Open 3D Simulation (Explode · Isolate · Gestures)'
                            : 'Mở Mô Phỏng 3D Đầy Đủ Tính Năng Ngay'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Feature Parity Notice */}
          <div className="spatial-soft-frame px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>
              {isEn
                ? 'Scanned 3D objects unlock full Lab features: 2-hand explode, 2-finger isolate + STEM info, 4-finger reassemble, slice plane & .OBJ export.'
                : 'Mô hình 3D tạo từ camera hỗ trợ đầy đủ tính năng: tách lớp 2 tay, soi từng bộ phận 2 ngón, ghép 4 ngón, mặt cắt & xuất .OBJ.'}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
