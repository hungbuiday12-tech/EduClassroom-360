import React, { useMemo, useRef, useState } from 'react';
import { CheckCircle2, FileWarning, FolderUp, Layers, RotateCcw, X } from 'lucide-react';
import {
  AnatomyAssetReportSummary,
  AnatomyGltfSlotSpec,
  resolveSlotAvailability
} from './engine/bioAnatomyAssetSystem';

interface AnatomyAssetManagerModalProps {
  open: boolean;
  onClose: () => void;
  bundledFiles: readonly string[];
  sessionUploadedSlots: ReadonlyMap<string, string>;
  onUploadSlotFile: (slot: AnatomyGltfSlotSpec, file: File) => Promise<void>;
  onRestoreSlot: (slotId: string) => void;
}

export const AnatomyAssetManagerModal: React.FC<AnatomyAssetManagerModalProps> = ({
  open,
  onClose,
  bundledFiles,
  sessionUploadedSlots,
  onUploadSlotFile,
  onRestoreSlot
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingSlotRef = useRef<AnatomyGltfSlotSpec | null>(null);
  const [busySlotId, setBusySlotId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const report: AnatomyAssetReportSummary = useMemo(
    () => resolveSlotAvailability(bundledFiles, sessionUploadedSlots),
    [bundledFiles, sessionUploadedSlots]
  );

  if (!open) return null;

  const triggerFilePick = (slot: AnatomyGltfSlotSpec) => {
    setErrorMsg(null);
    setStatusMsg(null);
    pendingSlotRef.current = slot;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slot = pendingSlotRef.current;
    if (!file || !slot) return;
    setBusySlotId(slot.slotId);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      await onUploadSlotFile(slot, file);
      setStatusMsg(`Đã nạp thành công "${file.name}" vào vị trí ${slot.labelVi}.`);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? `Không đọc được file GLB/GLTF: ${err.message}`
          : 'Không đọc được file GLB/GLTF. Vui lòng kiểm tra định dạng chuẩn glTF 2.0.'
      );
    } finally {
      setBusySlotId(null);
      pendingSlotRef.current = null;
    }
  };

  return (
    <div
      data-testid="anatomy-asset-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Hệ thống Asset GLB/GLTF Giải phẫu Cơ thể Người"
    >
      <div className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl border border-teal-500/40 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/90 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-extrabold text-white">
              <Layers className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="truncate">Hệ thống Tài nguyên Giải phẫu GLB / GLTF (Human Anatomy)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hỗ trợ glTF 2.0 + Draco nén. Trạng thái hiện tại:{' '}
              <span className="font-mono font-bold text-teal-300">
                {report.readyCount}/{report.totalSlots} slot có GLB
              </span>{' '}
              ·{' '}
              <span className="font-mono font-bold text-amber-300">
                {report.missingCount} slot chưa có file GLB
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer shrink-0"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 pb-6 overflow-y-auto space-y-3 text-xs">
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div
            className={`rounded-xl border px-3 py-2.5 text-[11px] leading-relaxed ${
              report.readyCount === 0
                ? 'border-amber-500/45 bg-amber-950/40 text-amber-100'
                : 'border-teal-500/45 bg-teal-950/40 text-teal-100'
            }`}
          >
            {report.readyCount === 0 ? (
              <>
                <span className="font-bold text-amber-300">Báo cáo tài nguyên:</span> Kho{' '}
                <code className="px-1 py-0.5 rounded bg-slate-950 text-amber-200">/public/assets/anatomy/</code>{' '}
                hiện chưa có file <code className="px-1 py-0.5 rounded bg-slate-950">.glb/.gltf</code> giải phẫu y khoa
                đi kèm. Hệ thống đã sẵn sàng bộ nạp Draco + chuẩn hóa tọa độ Box3 cho toàn bộ {report.totalSlots} vị trí
                bên dưới; bạn có thể nạp trực tiếp file <code className="px-1 py-0.5 rounded bg-slate-950">.glb</code>{' '}
                từng cơ quan hoặc file toàn thân đa lưới để thay thế trực tiếp vào các hệ cơ quan.
              </>
            ) : (
              <>
                <span className="font-bold text-teal-300">Đã kích hoạt GLB/GLTF:</span> Đang sử dụng{' '}
                {report.readyCount}/{report.totalSlots} tài nguyên GLB. Còn {report.missingCount} cơ quan chưa có file
                GLB vẫn hiển thị bằng mô hình giải phẫu PBR tỷ lệ chuẩn.
              </>
            )}
          </div>

          {statusMsg && (
            <div className="rounded-lg border border-emerald-500/50 bg-emerald-950/60 px-3 py-2 text-emerald-200 font-semibold">
              {statusMsg}
            </div>
          )}
          {errorMsg && (
            <div className="rounded-lg border border-rose-500/50 bg-rose-950/60 px-3 py-2 text-rose-200 font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            {report.items.map(({ slot, status, activeSourceLabel, hasRealGltf }) => {
              const isBusy = busySlotId === slot.slotId;
              return (
                <div
                  key={slot.slotId}
                  className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      {hasRealGltf ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <FileWarning className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span className="font-bold text-white truncate">{slot.labelVi}</span>
                      <span className="text-[10px] italic text-slate-400 hidden sm:inline truncate">
                        {slot.latinName}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-6 break-all">
                      {status === 'missing_glb' ? (
                        <>
                          <span className="text-amber-300 font-semibold">Chưa có tài nguyên GLB</span> · Đường dẫn
                          chuẩn: <code className="text-slate-300">{slot.expectedPublicPath}</code>
                        </>
                      ) : (
                        <span className="text-emerald-300 font-semibold">Đã nạp GLB: {activeSourceLabel}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pl-6 sm:pl-0 shrink-0">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => triggerFilePick(slot)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white text-[11px] font-bold cursor-pointer whitespace-nowrap"
                    >
                      <FolderUp className="w-3.5 h-3.5" />
                      <span>{isBusy ? 'Đang nạp...' : hasRealGltf ? 'Đổi GLB' : 'Nạp .GLB/.GLTF'}</span>
                    </button>
                    {status === 'glb_loaded' && (
                      <button
                        type="button"
                        onClick={() => onRestoreSlot(slot.organId)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px] font-semibold cursor-pointer whitespace-nowrap"
                        title="Khôi phục mô hình PBR mặc định"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Khôi phục</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
