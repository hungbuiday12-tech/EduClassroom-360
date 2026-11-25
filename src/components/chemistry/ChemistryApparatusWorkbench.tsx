import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CHEM_APPARATUS_BY_ID,
  CHEM_APPARATUS_CATEGORIES,
  CHEM_APPARATUS_CATALOG,
  ChemApparatusCategoryId,
  ChemApparatusItem,
  evaluateChemApparatusReading,
  getRecommendedChemToolsForSim
} from '../../data/chemistryApparatusData';
import { ChemistryDomainId } from '../../types';
import {
  ChevronDown,
  ChevronUp,
  FlaskConical,
  GripVertical,
  Plus,
  RotateCw,
  Search,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface PlacedChemApparatusInstance {
  uid: string;
  toolId: string;
  xPct: number;
  yPct: number;
  rotationDeg: number;
  customValue?: number;
}

interface ChemistryApparatusWorkbenchProps {
  dimension: '2d' | '3d';
  simId: string;
  domainId: ChemistryDomainId;
  simParams: Record<string, number>;
  simTimeRef?: React.MutableRefObject<number>;
  simTime?: number;
  stageClassName?: string;
  onPlacedToolsChange?: (tools: PlacedChemApparatusInstance[]) => void;
  children: React.ReactNode;
}

const LifelikeChemInstrumentGraphic: React.FC<{
  spec: ChemApparatusItem;
  readingValue: string;
  subLabel: string;
  fluidHex?: string;
  fillRatio?: number;
  simTime: number;
}> = ({ spec, readingValue, subLabel, fluidHex = '#38bdf8', fillRatio = 0.6, simTime }) => {
  const uid = spec.id.replace(/[^a-z0-9]/gi, '');

  // 1. Digital Meters (pH, Balance, Conductivity, Voltmeter, Colorimeter)
  if (
    spec.widgetKind === 'ph_meter' ||
    spec.widgetKind === 'balance' ||
    spec.widgetKind === 'conductivity' ||
    spec.widgetKind === 'voltmeter' ||
    spec.widgetKind === 'colorimeter'
  ) {
    const bodyCol =
      spec.widgetKind === 'ph_meter'
        ? '#0f766e'
        : spec.widgetKind === 'balance'
        ? '#334155'
        : spec.widgetKind === 'voltmeter'
        ? '#5b21b6'
        : spec.widgetKind === 'colorimeter'
        ? '#1e293b'
        : '#0369a1';
    return (
      <svg viewBox="0 0 128 112" className="w-[122px] h-[106px] overflow-visible drop-shadow-[0_10px_16px_rgba(0,0,0,0.48)]">
        <rect x="10" y="14" width="108" height="86" rx="10" fill={bodyCol} stroke="#0f172a" strokeWidth="2" />
        <rect x="18" y="24" width="92" height="36" rx="4" fill="#d1fae5" stroke="#064e3b" strokeWidth="1.6" />
        <text x="64" y="47" textAnchor="middle" fill="#064e3b" fontSize="11.5" fontWeight="900" fontFamily="monospace">
          {readingValue.slice(0, 12)}
        </text>
        <rect x="20" y="66" width="88" height="14" rx="2.5" fill="rgba(15,23,42,0.55)" />
        <text x="64" y="76" textAnchor="middle" fill="#e2e8f0" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">
          {subLabel.slice(0, 18)}
        </text>
        <circle cx="34" cy="90" r="4.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="64" cy="90" r="4.5" fill="#f59e0b" />
        <circle cx="94" cy="90" r="4.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
        {spec.widgetKind === 'ph_meter' && (
          <path d="M 118 42 Q 134 42 134 78 L 134 106" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
        )}
      </svg>
    );
  }

  // 2. Titration Burette 50mL
  if (spec.widgetKind === 'burette') {
    const hLiq = Math.max(12, Math.min(82, fillRatio * 82));
    return (
      <svg viewBox="0 0 64 160" className="w-[60px] h-[150px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]">
        <rect x="22" y="10" width="20" height="106" rx="3" fill="rgba(224,242,254,0.22)" stroke="#bae6fd" strokeWidth="1.6" />
        <rect x="24" y={114 - hLiq} width="16" height={hLiq} rx="1.5" fill={fluidHex} fillOpacity="0.72" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1="22" y1={22 + i * 10} x2={i % 2 === 0 ? 33 : 28} y2={22 + i * 10} stroke="#f8fafc" strokeWidth="1" />
        ))}
        {/* PTFE Stopcock */}
        <rect x="14" y="120" width="36" height="9" rx="3" fill="#f8fafc" stroke="#334155" strokeWidth="1.4" />
        <polygon points="29,129 35,129 32,146" fill="rgba(224,242,254,0.55)" stroke="#bae6fd" strokeWidth="1" />
        {/* Falling drop */}
        <circle cx="32" cy={149 + ((simTime * 18) % 10)} r="2.2" fill={fluidHex} />
        <rect x="4" y="144" width="56" height="14" rx="3" fill="rgba(15,23,42,0.85)" />
        <text x="32" y="154" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold" fontFamily="monospace">
          {readingValue}
        </text>
      </svg>
    );
  }

  // 3. Erlenmeyer / Beaker / Volumetric Flask
  if (spec.widgetKind === 'erlenmeyer' || spec.widgetKind === 'beaker' || spec.widgetKind === 'volumetric') {
    return (
      <svg viewBox="0 0 100 118" className="w-[94px] h-[110px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]">
        <defs>
          <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.34)" />
            <stop offset="100%" stopColor="rgba(148,163,184,0.14)" />
          </linearGradient>
        </defs>
        {spec.widgetKind === 'erlenmeyer' ? (
          <>
            <path d="M 38 14 L 38 38 L 14 92 Q 12 98 20 98 L 80 98 Q 88 98 86 92 L 62 38 L 62 14 Z" fill={`url(#glass-${uid})`} stroke="#bae6fd" strokeWidth="1.8" />
            <path d="M 24 72 L 76 72 L 84 92 Q 85 96 79 96 L 21 96 Q 15 96 16 92 Z" fill={fluidHex} fillOpacity="0.72" />
          </>
        ) : spec.widgetKind === 'volumetric' ? (
          <>
            <rect x="42" y="10" width="16" height="40" fill={`url(#glass-${uid})`} stroke="#bae6fd" strokeWidth="1.6" />
            <circle cx="50" cy="72" r="28" fill={`url(#glass-${uid})`} stroke="#bae6fd" strokeWidth="1.8" />
            <path d="M 24 74 A 26 26 0 0 0 76 74 Z" fill={fluidHex} fillOpacity="0.74" />
            <line x1="41" y1="30" x2="59" y2="30" stroke="#f8fafc" strokeWidth="1.5" />
          </>
        ) : (
          <>
            <path d="M 20 18 L 20 94 Q 20 98 26 98 L 74 98 Q 80 98 80 94 L 80 18" fill={`url(#glass-${uid})`} stroke="#bae6fd" strokeWidth="1.8" />
            <rect x="22" y="54" width="56" height="42" rx="3" fill={fluidHex} fillOpacity="0.7" />
          </>
        )}
        <rect x="18" y="101" width="64" height="14" rx="3" fill="rgba(15,23,42,0.85)" />
        <text x="50" y="111" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold" fontFamily="monospace">
          {readingValue}
        </text>
      </svg>
    );
  }

  // 4. Bunsen Burner
  if (spec.widgetKind === 'bunsen') {
    const flicker = Math.sin(simTime * 16) * 3;
    return (
      <svg viewBox="0 0 90 132" className="w-[82px] h-[122px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.5)]">
        <ellipse cx="45" cy="116" rx="28" ry="8" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
        <rect x="38" y="54" width="14" height="62" fill="#94a3b8" stroke="#475569" strokeWidth="1.4" />
        {/* Flame */}
        <path d={`M 35 54 Q 45 ${6 + flicker} 55 54 Z`} fill="rgba(56,189,248,0.75)" />
        <path d={`M 40 54 Q 45 ${24 + flicker * 0.5} 50 54 Z`} fill="rgba(253,224,71,0.9)" />
        <rect x="16" y="116" width="58" height="14" rx="3" fill="rgba(15,23,42,0.88)" />
        <text x="45" y="126" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold" fontFamily="monospace">
          {readingValue}
        </text>
      </svg>
    );
  }

  // 5. Thermometer
  if (spec.widgetKind === 'thermometer') {
    const hBar = Math.max(16, Math.min(72, fillRatio * 70));
    return (
      <svg viewBox="0 0 56 144" className="w-[52px] h-[134px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]">
        <rect x="21" y="10" width="14" height="96" rx="7" fill="rgba(226,232,240,0.28)" stroke="#cbd5e1" strokeWidth="1.6" />
        <circle cx="28" cy="112" r="11" fill="#ef4444" stroke="#991b1b" strokeWidth="1.4" />
        <rect x="25.5" y={104 - hBar} width="5" height={hBar} rx="2.5" fill="#ef4444" />
        <rect x="2" y="126" width="52" height="14" rx="3" fill="rgba(15,23,42,0.88)" />
        <text x="28" y="136" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold" fontFamily="monospace">
          {readingValue}
        </text>
      </svg>
    );
  }

  // 6. Gas Syringe / Hotplate / Condenser / Separatory / Pipette compact realistic SVG
  return (
    <svg viewBox="0 0 120 88" className="w-[114px] h-[82px] overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.48)]">
      <rect x="8" y="10" width="104" height="58" rx="9" fill="#0f172a" stroke={spec.accentHex} strokeWidth="2" />
      <circle cx="26" cy="39" r="12" fill={spec.accentHex} fillOpacity="0.22" stroke={spec.accentHex} strokeWidth="1.4" />
      <text x="26" y="43" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="900" fontFamily="monospace">
        {spec.symbol}
      </text>
      <text x="44" y="34" fill="#cbd5e1" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
        {spec.viName.slice(0, 15)}
      </text>
      <text x="44" y="52" fill="#34d399" fontSize="10.5" fontWeight="900" fontFamily="monospace">
        {readingValue.slice(0, 13)}
      </text>
    </svg>
  );
};

export const ChemistryApparatusWorkbench: React.FC<ChemistryApparatusWorkbenchProps> = ({
  dimension,
  simId,
  domainId,
  simParams,
  simTimeRef,
  simTime = 0,
  stageClassName = '',
  onPlacedToolsChange,
  children
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ChemApparatusCategoryId>('all');
  const [placedTools, setPlacedTools] = useState<PlacedChemApparatusInstance[]>([]);
  const [show2DOverlayIn3D, setShow2DOverlayIn3D] = useState(false);
  const [, setTick] = useState(0);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const draggingUidRef = useRef<string | null>(null);

  useEffect(() => {
    onPlacedToolsChange?.(placedTools);
  }, [placedTools, onPlacedToolsChange]);

  useEffect(() => {
    if (placedTools.length === 0) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % 10000), 120);
    return () => window.clearInterval(id);
  }, [placedTools.length]);

  const currentSimTime = simTimeRef ? simTimeRef.current : simTime;

  const recommendedIds = useMemo(
    () => getRecommendedChemToolsForSim(dimension, simId, domainId),
    [dimension, simId, domainId]
  );

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CHEM_APPARATUS_CATALOG.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.viName.toLowerCase().includes(q) ||
        item.enName.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q)
      );
    });
  }, [categoryFilter, searchQuery]);

  const addToolAt = (toolId: string, xPct?: number, yPct?: number) => {
    const count = placedTools.length;
    setPlacedTools((prev) => [
      ...prev,
      {
        uid: `${toolId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        toolId,
        xPct: xPct ?? 18 + ((count * 15) % 66),
        yPct: yPct ?? 24 + ((count * 14) % 52),
        rotationDeg: 0
      }
    ]);
  };

  const quickAddRecommendedKit = () => {
    setPlacedTools((prev) => {
      const existingIds = new Set(prev.map((p) => p.toolId));
      const additions: PlacedChemApparatusInstance[] = [];
      recommendedIds.forEach((tid, idx) => {
        if (!existingIds.has(tid)) {
          additions.push({
            uid: `${tid}-${Date.now()}-${idx}`,
            toolId: tid,
            xPct: 16 + ((prev.length + idx) * 20) % 68,
            yPct: 24 + ((prev.length + idx) % 2) * 34,
            rotationDeg: 0
          });
        }
      });
      return [...prev, ...additions];
    });
  };

  const handleStageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes('application/x-chem-tool')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleStageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const toolId = e.dataTransfer.getData('application/x-chem-tool');
    if (!toolId || !stageRef.current) return;
    e.preventDefault();
    const rect = stageRef.current.getBoundingClientRect();
    const xPct = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    addToolAt(toolId, xPct, yPct);
  };

  const handleWidgetPointerDown = (e: React.PointerEvent<HTMLDivElement>, inst: PlacedChemApparatusInstance) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    e.preventDefault();
    draggingUidRef.current = inst.uid;
    const onMove = (mv: PointerEvent) => {
      if (!draggingUidRef.current || !stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const nx = Math.max(6, Math.min(94, ((mv.clientX - rect.left) / rect.width) * 100));
      const ny = Math.max(8, Math.min(92, ((mv.clientY - rect.top) / rect.height) * 100));
      setPlacedTools((prev) =>
        prev.map((item) => (item.uid === draggingUidRef.current ? { ...item, xPct: nx, yPct: ny } : item))
      );
    };
    const onUp = () => {
      draggingUidRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div className="space-y-1.5">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/95 px-2.5 py-2 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isEn ? 'Suggested Lab Kit:' : 'Bộ dụng cụ hóa học gợi ý:'}</span>
            </span>
            {recommendedIds.map((tid) => {
              const spec = CHEM_APPARATUS_BY_ID[tid];
              if (!spec) return null;
              return (
                <button
                  key={tid}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/x-chem-tool', tid);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => addToolAt(tid)}
                  title={isEn ? spec.shortDescEn : spec.shortDescVi}
                  className="sim-btn-chem inline-flex items-center gap-1 px-2 py-1 rounded-[3px] text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500 cursor-grab active:cursor-grabbing whitespace-nowrap"
                >
                  <Plus className="w-3 h-3 text-emerald-500" />
                  <span>{isEn ? spec.enName : spec.viName}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={quickAddRecommendedKit}
              className="sim-btn-chem px-2.5 py-1 rounded-[3px] border border-emerald-400/60 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer whitespace-nowrap"
            >
              {isEn ? '+ Quick Kit' : '+ Đặt bộ gợi ý'}
            </button>

            {placedTools.length > 0 && dimension === '3d' && (
              <button
                type="button"
                onClick={() => setShow2DOverlayIn3D((v) => !v)}
                className={`sim-btn-chem inline-flex items-center gap-1 px-2 py-1 rounded-[3px] text-[11px] font-semibold border cursor-pointer whitespace-nowrap ${
                  show2DOverlayIn3D
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                }`}
              >
                <span>{show2DOverlayIn3D ? 'Ẩn dụng cụ 2D' : 'Hiện dụng cụ 2D'}</span>
              </button>
            )}

            {placedTools.length > 0 && (
              <button
                type="button"
                onClick={() => setPlacedTools([])}
                className="sim-btn-chem inline-flex items-center gap-1 px-2 py-1 rounded-[3px] text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 cursor-pointer"
                title={isEn ? 'Remove all apparatus' : 'Cất hết dụng cụ'}
              >
                <Trash2 className="w-3 h-3" />
                <span>({placedTools.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setDrawerOpen((o) => !o)}
              className={`sim-btn-chem inline-flex items-center gap-1 px-2.5 py-1 rounded-[3px] text-[11px] font-bold border cursor-pointer whitespace-nowrap ${
                drawerOpen
                  ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 border-slate-900 dark:border-emerald-400'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>{isEn ? `Chem Apparatus (${CHEM_APPARATUS_CATALOG.length})` : `Kho dụng cụ Hóa (${CHEM_APPARATUS_CATALOG.length})`}</span>
              {drawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {drawerOpen && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search glassware, pH meter, burette...' : 'Tìm kiếm buret, bình tam giác, máy đo pH...'}
                  className="w-full pl-8 pr-7 py-1.5 rounded-md bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1">
                {CHEM_APPARATUS_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                      categoryFilter === cat.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    {isEn ? cat.en : cat.vi}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/x-chem-tool', item.id);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => addToolAt(item.id)}
                  title={isEn ? item.shortDescEn : item.shortDescVi}
                  className="flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-md bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-grab active:cursor-grabbing select-none transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-extrabold text-white shrink-0"
                      style={{ backgroundColor: item.accentHex }}
                    >
                      {item.symbol}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
                        {isEn ? item.enName : item.viName}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">{item.unit}</div>
                    </div>
                  </div>
                  <GripVertical className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        ref={stageRef}
        onDragOver={handleStageDragOver}
        onDrop={handleStageDrop}
        className={`relative ${stageClassName}`}
      >
        {children}

        {placedTools.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none">
            {placedTools.map((inst) => {
              const spec = CHEM_APPARATUS_BY_ID[inst.toolId];
              if (!spec) return null;
              const reading = evaluateChemApparatusReading(
                inst.toolId,
                simId,
                simParams,
                currentSimTime,
                inst.xPct,
                inst.yPct
              );
              const removeOne = () =>
                setPlacedTools((prev) => prev.filter((item) => item.uid !== inst.uid));
              const rotateBy = (delta: number) =>
                setPlacedTools((prev) =>
                  prev.map((item) =>
                    item.uid === inst.uid
                      ? { ...item, rotationDeg: (item.rotationDeg + delta + 360) % 360 }
                      : item
                  )
                );

              if (dimension === '3d' && !show2DOverlayIn3D) {
                return (
                  <div
                    key={inst.uid}
                    onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                    style={{
                      left: `${inst.xPct}%`,
                      top: `${inst.yPct}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="pointer-events-auto absolute cursor-move group flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/85 text-white shadow whitespace-nowrap border border-slate-700/80"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: spec.accentHex }} />
                    <span className="text-[10px] font-bold text-slate-200 max-w-[100px] truncate">
                      {isEn ? spec.enName : spec.viName}
                    </span>
                    <span className="text-[10px] font-mono font-extrabold text-emerald-400 tabular-nums">
                      {reading.valueText}
                    </span>
                    <button
                      type="button"
                      onClick={() => rotateBy(30)}
                      className="opacity-70 hover:opacity-100 text-amber-300 cursor-pointer"
                      title="Xoay dụng cụ 3D (+30°)"
                    >
                      <RotateCw className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={removeOne}
                      className="opacity-70 hover:opacity-100 text-rose-400 cursor-pointer"
                      title="Gỡ dụng cụ 3D"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={inst.uid}
                  onPointerDown={(e) => handleWidgetPointerDown(e, inst)}
                  style={{
                    left: `${inst.xPct}%`,
                    top: `${inst.yPct}%`,
                    transform: `translate(-50%, -50%) rotate(${inst.rotationDeg}deg)`
                  }}
                  className="pointer-events-auto absolute cursor-move group bg-transparent"
                  title={`${isEn ? spec.enName : spec.viName} — ${reading.valueText}`}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 right-0 flex items-center gap-0.5 bg-slate-900/90 rounded-full px-1 py-0.5 shadow z-20">
                    <button
                      type="button"
                      onClick={() => rotateBy(15)}
                      className="w-4 h-4 rounded-full hover:bg-slate-700 text-amber-300 flex items-center justify-center cursor-pointer"
                      title="Xoay +15°"
                    >
                      <RotateCw className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={removeOne}
                      className="w-4 h-4 rounded-full hover:bg-rose-600 text-rose-300 hover:text-white flex items-center justify-center cursor-pointer"
                      title="Cất dụng cụ"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <LifelikeChemInstrumentGraphic
                    spec={spec}
                    readingValue={reading.valueText}
                    subLabel={reading.subLabel}
                    fluidHex={reading.fluidHex}
                    fillRatio={reading.fillRatio}
                    simTime={currentSimTime}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
