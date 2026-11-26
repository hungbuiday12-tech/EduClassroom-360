import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Droplets,
  HeartPulse,
  Leaf,
  Moon,
  Pause,
  Play,
  RotateCcw,
  ScanEye,
  Sparkles,
  Sun,
  Thermometer,
  Wind,
  Zap,
} from 'lucide-react';
import { useBackgroundTheme } from '../../../context/BackgroundContext';

type RoleDomain = 'plant' | 'animal';
type PlantSpeciesId = 'bean' | 'cactus' | 'mangrove';
type AnimalSpeciesId = 'frog' | 'butterfly' | 'salmon' | 'polar_bear';
type SpeciesId = PlantSpeciesId | AnimalSpeciesId;
type ClimateId = 'normal' | 'drought' | 'pollution' | 'warming';
type TraitId =
  | 'deep_root'
  | 'thick_cuticle'
  | 'aerenchyma'
  | 'moist_skin'
  | 'efficient_wings'
  | 'osmo_shield'
  | 'thick_blubber';

interface StageDef {
  title: string;
  bioFocus: string;
  goalText: string;
}

interface SpeciesSpec {
  id: SpeciesId;
  domain: RoleDomain;
  nameVi: string;
  habitatVi: string;
  adaptationVi: string;
  specialActionLabel: string;
  unlockTraitId: TraitId;
  stages: [StageDef, StageDef, StageDef, StageDef];
}

interface TraitCard {
  id: TraitId;
  nameVi: string;
  effectVi: string;
  forDomain: RoleDomain | 'all';
}

const TRAIT_CARDS: TraitCard[] = [
  { id: 'deep_root', nameVi: 'Rễ cọc siêu sâu', effectVi: '+45% hút nước ngầm khi hạn hán', forDomain: 'plant' },
  { id: 'thick_cuticle', nameVi: 'Lớp sáp Cutin & Gai dày', effectVi: 'Giảm 55% thoát hơi nước ban ngày', forDomain: 'plant' },
  { id: 'aerenchyma', nameVi: 'Mô khí & Rễ thở', effectVi: 'Cấp O₂ cho rễ trong vùng ngập/ô nhiễm', forDomain: 'plant' },
  { id: 'moist_skin', nameVi: 'Da tiết nhầy giữ ẩm', effectVi: 'Giảm mất nước & tăng hô hấp qua da', forDomain: 'animal' },
  { id: 'efficient_wings', nameVi: 'Cơ bay & Biến thái tối ưu', effectVi: 'Giảm 35% tiêu hao ATP khi di chuyển', forDomain: 'animal' },
  { id: 'osmo_shield', nameVi: 'Màng mang lọc độc tố', effectVi: 'Chịu môi trường thiếu O₂ & ô nhiễm nước', forDomain: 'animal' },
  { id: 'thick_blubber', nameVi: 'Mỡ cách nhiệt & Ngụy trang', effectVi: 'Ổn định thân nhiệt khi khí hậu cực đoan', forDomain: 'animal' },
];

const CLIMATES: { id: ClimateId; nameVi: string; tempBias: number; waterDrain: number; o2Penalty: number }[] = [
  { id: 'normal', nameVi: 'Tự nhiên cân bằng', tempBias: 0, waterDrain: 1.0, o2Penalty: 0 },
  { id: 'drought', nameVi: 'Hạn hán khắc nghiệt', tempBias: 7, waterDrain: 1.75, o2Penalty: 4 },
  { id: 'pollution', nameVi: 'Ô nhiễm & Thiếu O₂', tempBias: 2, waterDrain: 1.2, o2Penalty: 22 },
  { id: 'warming', nameVi: 'Biến đổi khí hậu (+4°C)', tempBias: 4, waterDrain: 1.45, o2Penalty: 10 },
];

const SPECIES_LIST: SpeciesSpec[] = [
  {
    id: 'bean',
    domain: 'plant',
    nameVi: 'Cây Đậu (Thực vật C3)',
    habitatVi: 'Đất đồng bằng đủ nắng ẩm',
    adaptationVi: 'Tính hướng sáng ở thân, hướng đất/nước ở rễ & đóng mở khí khổng theo nắng.',
    specialActionLabel: 'Tiết mật & Hướng sáng',
    unlockTraitId: 'deep_root',
    stages: [
      { title: '1. Hạt giống (Ngủ nghỉ)', bioFocus: 'Kích hoạt enzyme amylase khi đủ ẩm & ấm (22–32°C)', goalText: 'Đủ độ ẩm & nhiệt độ để nảy mầm' },
      { title: '2. Cây mầm & Sinh trưởng', bioFocus: 'Hướng đất/nước ở rễ, hướng sáng ở thân để tích ATP', goalText: 'Phân bổ rễ + thân lá đạt 100% sinh trưởng' },
      { title: '3. Trưởng thành & Khí khổng', bioFocus: 'Mở khí khổng hút CO₂ khi mát; đóng tránh héo lúc nắng gắt', goalText: 'Tích lũy ATP & tránh héo quá độ' },
      { title: '4. Ra hoa, Thụ phấn & Tạo hạt', bioFocus: 'Tạo sắc tố & mật hoa thu hút côn trùng thụ phấn', goalText: 'Kích hoạt thụ phấn để hoàn thành vòng đời' },
    ],
  },
  {
    id: 'cactus',
    domain: 'plant',
    nameVi: 'Cây Xương Rồng (Sa mạc)',
    habitatVi: 'Sa mạc nắng gắt, ít mưa',
    adaptationVi: 'Biến lá thành gai giảm thoát nước, thân mọng nước & mở khí khổng ban đêm (CAM).',
    specialActionLabel: 'Biến lá thành gai (CAM)',
    unlockTraitId: 'thick_cuticle',
    stages: [
      { title: '1. Hạt ngủ nghỉ chờ mưa', bioFocus: 'Vỏ hạt dày chịu nóng, chờ cơn mưa hiếm hoi để nảy mầm', goalText: 'Giữ nước và kích hoạt nảy mầm' },
      { title: '2. Mọc rễ nông lan rộng', bioFocus: 'Phân bổ rễ ăn nông lan rộng hứng nhanh giọt mưa bề mặt', goalText: 'Tích trữ nước vào thân mọng' },
      { title: '3. Biến lá thành gai (CAM)', bioFocus: 'Đóng khí khổng ban ngày nắng gắt, chỉ mở ban đêm hút CO₂', goalText: 'Hoạt hóa thích nghi gai & giữ nước > 40%' },
      { title: '4. Nở hoa sa mạc & Kết quả', bioFocus: 'Nở hoa nhanh thu hút bọ/chim thụ phấn tạo thế hệ hạt mới', goalText: 'Tạo hạt giống sa mạc thành công' },
    ],
  },
  {
    id: 'mangrove',
    domain: 'plant',
    nameVi: 'Cây Đước (Rừng ngập mặn)',
    habitatVi: 'Bãi bùn ven biển thủy triều',
    adaptationVi: 'Rễ chống đứng vững trước sóng & rễ thở (khí sinh) lấy O₂ từ không khí trong bùn lầy.',
    specialActionLabel: 'Mọc rễ chống & Rễ thở',
    unlockTraitId: 'aerenchyma',
    stages: [
      { title: '1. Trụ mầm (Thai sinh)', bioFocus: 'Hạt nảy mầm ngay trên cây mẹ, cắm xuống bùn khi thủy triều rút', goalText: 'Cắm trụ mầm bám bùn thành công' },
      { title: '2. Hình thành Rễ chống', bioFocus: 'Phát triển hệ rễ chống hình nơm giữ thân trước sóng triều', goalText: 'Mọc rễ chống vững chắc' },
      { title: '3. Mọc Rễ thở khí sinh', bioFocus: 'Rễ mọc ngược lên mặt bùn lấy O₂ & tuyến tiết muối mặn', goalText: 'Duy trì O₂ rễ và áp suất thẩm thấu' },
      { title: '4. Ra hoa & Phát tán trụ mầm', bioFocus: 'Thụ phấn nhờ gió/côn trùng và hình thành trụ mầm mới', goalText: 'Hoàn tất vòng đời rừng ngập mặn' },
    ],
  },
  {
    id: 'frog',
    domain: 'animal',
    nameVi: 'Ếch đồng (Lưỡng cư)',
    habitatVi: 'Ao nước ngọt & bờ cỏ ẩm',
    adaptationVi: 'Biến thái hoàn toàn: Mang → Tiêu biến mang & mọc phổi → Lên cạn giữ ẩm hô hấp qua da.',
    specialActionLabel: 'Bắt mồi / Giữ ẩm da',
    unlockTraitId: 'moist_skin',
    stages: [
      { title: '1. Trứng (Dưới nước)', bioFocus: 'Bọc nhầy bảo vệ phôi, phụ thuộc nhiệt độ nước & tránh cá nhỏ', goalText: 'Giữ ấm ổn định để nở thành nòng nọc' },
      { title: '2. Nòng nọc (Hô hấp mang)', bioFocus: 'Bơi bằng đuôi, thở mang dưới nước, ăn tảo thủy sinh tích ATP', goalText: 'Ăn tảo & tích lũy đủ năng lượng biến thái' },
      { title: '3. Nòng nọc mọc chân (Hình thành phổi)', bioFocus: 'Đuôi & mang tiêu biến dần, phổi mở rộng — phải ngoi lên thở!', goalText: 'Ngoi lên mặt nước thở O₂ & hoàn tất mọc 4 chân' },
      { title: '4. Ếch trưởng thành (Lưỡng cư)', bioFocus: 'Săn mồi trên cạn bằng lưỡi, giữ ẩm da để thở qua da & sinh sản', goalText: 'Săn mồi, giữ da ẩm & đẻ trứng duy trì nòi giống' },
    ],
  },
  {
    id: 'butterfly',
    domain: 'animal',
    nameVi: 'Bướm (Biến thái hoàn toàn)',
    habitatVi: 'Vườn hoa & tán lá',
    adaptationVi: 'Trứng → Sâu bướm ăn lá → Nhộng tái cấu trúc mô → Bướm bay thụ phấn hoa.',
    specialActionLabel: 'Hút mật & Thụ phấn',
    unlockTraitId: 'efficient_wings',
    stages: [
      { title: '1. Trứng trên mặt lá', bioFocus: 'Ấp nhiệt mặt trời vừa phải, tránh bị kiến/chim phát hiện', goalText: 'Đủ ấm để nở thành sâu non' },
      { title: '2. Sâu bướm (Ấu trùng)', bioFocus: 'Ăn lá non liên tục tích trữ protein & lipid cho kén nhộng', goalText: 'Ăn lá đạt 100% dự trữ ATP' },
      { title: '3. Nhộng trong kén', bioFocus: 'Phân giải tế bào cũ, hình thành cánh & mắt kép bằng hô hấp ống khí', goalText: 'Giữ O₂ và thân nhiệt ổn định trong kén' },
      { title: '4. Bướm trưởng thành', bioFocus: 'Bay hút mật hoa & phát tán hạt phấn giúp cây thụ phấn', goalText: 'Hút mật & hoàn thành vòng đời thụ phấn' },
    ],
  },
  {
    id: 'salmon',
    domain: 'animal',
    nameVi: 'Cá Hồi (Di cư bẩm sinh)',
    habitatVi: 'Suối ngọt → Đại dương → Ngược dòng',
    adaptationVi: 'Thay đổi cơ chế điều hòa áp suất thẩm thấu ngọt/mặn & tập tính định vị mùi về nguồn đẻ trứng.',
    specialActionLabel: 'Vượt thác / Điều hòa muối',
    unlockTraitId: 'osmo_shield',
    stages: [
      { title: '1. Trứng dưới sỏi suối ngọt', bioFocus: 'Cần nước chảy giàu O₂ hòa tan và nhiệt độ lạnh sạch', goalText: 'Duy trì O₂ > 50% để cá bột nở' },
      { title: '2. Cá con nước ngọt', bioFocus: 'Ăn phù du, ghi nhớ mùi hóa học đặc trưng của dòng suối quê', goalText: 'Tích lũy ATP chuẩn bị xuôi dòng ra biển' },
      { title: '3. Cá trưởng thành đại dương', bioFocus: 'Thích nghi nước mặn qua mang thải muối, săn cá nhỏ tăng kích thước', goalText: 'Tích lũy năng lượng vượt đại dương' },
      { title: '4. Ngược dòng đẻ trứng', bioFocus: 'Tập tính bẩm sinh bơi ngược thác về đúng suối nguồn đẻ trứng', goalText: 'Vượt dòng xiết về thượng nguồn sinh sản' },
    ],
  },
  {
    id: 'polar_bear',
    domain: 'animal',
    nameVi: 'Gấu Bắc Cực (Hàn đới)',
    habitatVi: 'Băng trôi & vùng cực lạnh giá',
    adaptationVi: 'Lông trắng ngụy trang, lớp mỡ dày cách nhiệt & hạ chuyển hóa ngủ đông giữ ATP.',
    specialActionLabel: 'Ngụy trang / Ngủ đông giữ ATP',
    unlockTraitId: 'thick_blubber',
    stages: [
      { title: '1. Gấu con trong hang tuyết', bioFocus: 'Dựa vào thân nhiệt hang tuyết (-5°C bên ngoài) & sữa mẹ giàu mỡ', goalText: 'Giữ ấm cơ thể & tích năng lượng đầu đời' },
      { title: '2. Gấu non tập săn trên băng', bioFocus: 'Học tập tính săn mồi bên lỗ thở hải cẩu & bơi giữa băng trôi', goalText: 'Săn mồi thành công & tránh kiệt sức lạnh' },
      { title: '3. Trưởng thành tích lớp mỡ', bioFocus: 'Ngụy trang lông trắng trên tuyết, tích dày lớp mỡ chống rét', goalText: 'Tích trữ ATP & mỡ trước mùa đông' },
      { title: '4. Vượt mùa khắc nghiệt / Sinh sản', bioFocus: 'Hạ nhịp tim khi ngủ đông tiết kiệm ATP hoặc nuôi thế hệ mới', goalText: 'Sinh tồn qua mùa băng tan khắc nghiệt' },
    ],
  },
];

interface SimTarget {
  id: number;
  kind: 'food' | 'predator' | 'pollinator';
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const OrganismRoleplaySandbox: React.FC<{ isEn?: boolean }> = () => {
  const { perfMode } = useBackgroundTheme();
  const [domain, setDomain] = useState<RoleDomain>('plant');
  const [speciesId, setSpeciesId] = useState<SpeciesId>('bean');
  const [climateId, setClimateId] = useState<ClimateId>('normal');
  const [xrayMode, setXrayMode] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(true);

  const [stageIdx, setStageIdx] = useState<number>(0); // 0..3
  const [stageProgress, setStageProgress] = useState<number>(15); // 0..100
  const [atp, setAtp] = useState<number>(78);
  const [water, setWater] = useState<number>(74);
  const [bodyTemp, setBodyTemp] = useState<number>(26);
  const [oxygen, setOxygen] = useState<number>(85);

  // Plant physiological state
  const [isDaytime, setIsDaytime] = useState<boolean>(true);
  const [stomataOpen, setStomataOpen] = useState<boolean>(true);
  const [rootAlloc, setRootAlloc] = useState<number>(50); // 0..100 (rest goes to stem/leaves)
  const [morphAdapted, setMorphAdapted] = useState<boolean>(false);
  const [pollinated, setPollinated] = useState<boolean>(false);
  const [xrayStomataZoom, setXrayStomataZoom] = useState<boolean>(false);

  // Animal movement & physiological state
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.65 });
  const [hidingCamo, setHidingCamo] = useState<boolean>(false);
  const [skinMoist, setSkinMoist] = useState<number>(80);

  // Trait Tree progression
  const [unlockedTraits, setUnlockedTraits] = useState<TraitId[]>([]);
  const [activeTraits, setActiveTraits] = useState<TraitId[]>([]);
  const [lifecycleCompletedCount, setLifecycleCompletedCount] = useState<number>(0);

  const [causeAlert, setCauseAlert] = useState<{
    level: 'info' | 'warn' | 'ok';
    title: string;
    detail: string;
  }>({
    level: 'info',
    title: 'Bắt đầu vòng đời sinh học',
    detail: 'Quan sát thanh ATP, Nước, Nhiệt độ, Oxy và bật Góc nhìn Sinh học (X-Ray) để xem cơ chế bên trong.',
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetsRef = useRef<SimTarget[]>([]);
  const nextIdRef = useRef<number>(1);
  const playerTargetRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.65 });

  const species = useMemo(
    () => SPECIES_LIST.find((s) => s.id === speciesId) || SPECIES_LIST[0],
    [speciesId]
  );
  const climate = useMemo(
    () => CLIMATES.find((c) => c.id === climateId) || CLIMATES[0],
    [climateId]
  );

  const resetRun = (nextSpeciesId = speciesId) => {
    const sp = SPECIES_LIST.find((s) => s.id === nextSpeciesId) || SPECIES_LIST[0];
    setDomain(sp.domain);
    setSpeciesId(sp.id);
    setStageIdx(0);
    setStageProgress(12);
    setAtp(78);
    setWater(sp.id === 'cactus' ? 68 : 75);
    setBodyTemp(sp.id === 'polar_bear' ? 37 : sp.id === 'cactus' ? 32 : 25);
    setOxygen(86);
    setStomataOpen(sp.id !== 'cactus');
    setIsDaytime(true);
    setMorphAdapted(false);
    setPollinated(false);
    setXrayStomataZoom(false);
    setHidingCamo(false);
    setSkinMoist(85);
    setPlayerPos({ x: 0.5, y: sp.domain === 'animal' ? 0.68 : 0.72 });
    playerTargetRef.current = { x: 0.5, y: sp.domain === 'animal' ? 0.68 : 0.72 };

    // Spawn interactive food / predators
    const arr: SimTarget[] = [];
    for (let i = 0; i < 6; i++) {
      arr.push({
        id: nextIdRef.current++,
        kind: 'food',
        x: 0.12 + Math.random() * 0.76,
        y: sp.id === 'butterfly' ? 0.2 + Math.random() * 0.55 : 0.48 + Math.random() * 0.36,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.04,
      });
    }
    for (let i = 0; i < 2; i++) {
      arr.push({
        id: nextIdRef.current++,
        kind: 'predator',
        x: 0.15 + Math.random() * 0.7,
        y: 0.5 + Math.random() * 0.32,
        vx: (Math.random() > 0.5 ? 1 : -1) * 0.11,
        vy: (Math.random() - 0.5) * 0.04,
      });
    }
    targetsRef.current = arr;

    setCauseAlert({
      level: 'info',
      title: `Nhập vai: ${sp.nameVi}`,
      detail: `${sp.stages[0].bioFocus}. Hãy đáp ứng điều kiện sinh lý để tiến hóa qua 4 giai đoạn.`,
    });
  };

  useEffect(() => {
    resetRun('bean');
  }, []);

  const stateRef = useRef({
    domain,
    speciesId,
    climate,
    xrayMode,
    playing,
    stageIdx,
    stageProgress,
    atp,
    water,
    bodyTemp,
    oxygen,
    isDaytime,
    stomataOpen,
    rootAlloc,
    morphAdapted,
    pollinated,
    xrayStomataZoom,
    playerPos,
    hidingCamo,
    skinMoist,
    activeTraits,
    perfMode,
  });
  stateRef.current = {
    domain,
    speciesId,
    climate,
    xrayMode,
    playing,
    stageIdx,
    stageProgress,
    atp,
    water,
    bodyTemp,
    oxygen,
    isDaytime,
    stomataOpen,
    rootAlloc,
    morphAdapted,
    pollinated,
    xrayStomataZoom,
    playerPos,
    hidingCamo,
    skinMoist,
    activeTraits,
    perfMode,
  };

  const toggleTrait = (tId: TraitId) => {
    setActiveTraits((prev) =>
      prev.includes(tId) ? prev.filter((x) => x !== tId) : [...prev, tId]
    );
  };

  const handleToggleStomata = (open: boolean) => {
    setStomataOpen(open);
    if (open && isDaytime) {
      setXrayMode(true);
      setXrayStomataZoom(true);
      setCauseAlert({
        level: 'warn',
        title: 'Cảnh báo Sinh lý: Mở khí khổng giữa trưa nắng!',
        detail:
          speciesId === 'cactus'
            ? 'Xương rồng mở khí khổng ban ngày sẽ làm H₂O bốc hơi ồ ạt! Thực vật CAM phải đóng ban ngày và mở vào ban đêm.'
            : 'Chế độ X-Ray zoom vào khí khổng lá: H₂O đang thoát hơi ồ ạt giúp hút CO₂ quang hợp nhưng nếu thiếu nước cây sẽ héo!',
      });
    } else if (!open) {
      setXrayStomataZoom(false);
      setCauseAlert({
        level: 'ok',
        title: 'Đã đóng khí khổng bảo vệ tế bào',
        detail: 'Giảm tối đa thất thoát H₂O qua lỗ khí. Lưu ý cần mở lại khi mát để hấp thu CO₂ cho quang hợp.',
      });
    }
  };

  const handleSpecialAction = () => {
    if (domain === 'plant') {
      if (stageIdx === 3) {
        setPollinated(true);
        setStageProgress(100);
        setCauseAlert({
          level: 'ok',
          title: 'Thụ phấn & Tạo hạt thành công!',
          detail:
            speciesId === 'mangrove'
              ? 'Trụ mầm thai sinh đã hình thành sẵn sàng cắm xuống bùn ngập mặn.'
              : 'Hoa đã thu hút côn trùng/gió truyền hạt phấn, hình thành hạt giống thế hệ mới.',
        });
      } else {
        setMorphAdapted(true);
        setStageProgress((p) => Math.min(100, p + 25));
        setCauseAlert({
          level: 'ok',
          title: `Kích hoạt thích nghi: ${species.specialActionLabel}`,
          detail: species.adaptationVi,
        });
      }
    } else {
      // Animal special action
      if (speciesId === 'frog' && stageIdx === 2) {
        // Swim up to breathe
        playerTargetRef.current = { x: playerPos.x, y: 0.42 };
        setOxygen((o) => Math.min(100, o + 35));
        setCauseAlert({
          level: 'ok',
          title: 'Ngoi lên mặt nước hít O₂ bằng phổi mới!',
          detail: 'Giai đoạn mọc chân: mang đang tiêu biến nên ếch bắt buộc lên mặt nước thở O₂ không khí.',
        });
      } else if (speciesId === 'frog' && stageIdx === 3) {
        setSkinMoist(95);
        setWater((w) => Math.min(100, w + 20));
        setAtp((a) => Math.min(100, a + 12));
        setCauseAlert({
          level: 'ok',
          title: 'Giữ ẩm da & Phóng lưỡi săn côn trùng',
          detail: 'Da ếch luôn cần ẩm để trao đổi khí O₂/CO₂ trực tiếp qua mạng lưới mao mạch dưới da.',
        });
      } else if (speciesId === 'polar_bear') {
        setHidingCamo((h) => !h);
        setAtp((a) => Math.min(100, a + 14));
        setCauseAlert({
          level: 'ok',
          title: !hidingCamo ? 'Ngụy trang / Ngủ đông tiết kiệm ATP' : 'Rời trạng thái ngủ đông để săn mồi',
          detail: 'Gấu Bắc Cực hạ nhịp tim & chuyển hóa chất béo lớp mỡ dưới da để sống sót qua mùa giá rét.',
        });
      } else {
        setAtp((a) => Math.min(100, a + 16));
        setStageProgress((p) => Math.min(100, p + 18));
        setCauseAlert({
          level: 'ok',
          title: species.specialActionLabel,
          detail: species.adaptationVi,
        });
      }
    }
  };

  const advanceStageOrFinish = () => {
    if (stageIdx < 3) {
      const next = stageIdx + 1;
      setStageIdx(next);
      setStageProgress(15);
      setCauseAlert({
        level: 'ok',
        title: `Chuyển giai đoạn: ${species.stages[next].title}`,
        detail: species.stages[next].bioFocus,
      });
    } else {
      const rewardTrait = species.unlockTraitId;
      setUnlockedTraits((prev) => (prev.includes(rewardTrait) ? prev : [...prev, rewardTrait]));
      setActiveTraits((prev) => (prev.includes(rewardTrait) ? prev : [...prev, rewardTrait]));
      setLifecycleCompletedCount((c) => c + 1);
      const traitInfo = TRAIT_CARDS.find((t) => t.id === rewardTrait);
      setCauseAlert({
        level: 'ok',
        title: `Hoàn thành vòng đời ${species.nameVi}!`,
        detail: `Đã mở khóa thẻ tiến hóa "${traitInfo?.nameVi}": ${traitInfo?.effectVi}. Hãy thử nghiệm ở môi trường khắc nghiệt hơn!`,
      });
      setStageIdx(0);
      setStageProgress(15);
      setPollinated(false);
    }
  };

  // Physiological Tick Loop (1 Hz biological simulation updates)
  useEffect(() => {
    const timer = window.setInterval(() => {
      const s = stateRef.current;
      if (!s.playing) return;

      const hasDeepRoot = s.activeTraits.includes('deep_root');
      const hasCuticle = s.activeTraits.includes('thick_cuticle');
      const hasAerenchyma = s.activeTraits.includes('aerenchyma');
      const hasMoistSkin = s.activeTraits.includes('moist_skin');
      const hasEffWings = s.activeTraits.includes('efficient_wings');
      const hasOsmoShield = s.activeTraits.includes('osmo_shield');
      const hasBlubber = s.activeTraits.includes('thick_blubber');

      if (s.domain === 'plant') {
        const envTemp = (s.isDaytime ? 33 : 20) + s.climate.tempBias;
        setBodyTemp(Math.round(envTemp * 0.85));

        const rootFactor = s.rootAlloc / 100;
        const leafFactor = 1 - rootFactor;
        const waterIn = (hasDeepRoot ? 5.2 : 3.4) * rootFactor / Math.max(0.8, s.climate.waterDrain * 0.7);

        let transpireLoss = s.stomataOpen ? (s.isDaytime ? 5.6 : 1.8) : 0.7;
        if (s.speciesId === 'cactus' && s.morphAdapted) transpireLoss *= 0.42;
        if (hasCuticle) transpireLoss *= 0.45;
        transpireLoss *= s.climate.waterDrain;

        const nextWater = Math.max(5, Math.min(100, s.water + waterIn - transpireLoss));
        setWater(Math.round(nextWater));

        const canPhotosynth = s.stomataOpen && (s.isDaytime || (s.speciesId === 'cactus' && !s.isDaytime)) && nextWater > 18;
        const atpDelta = canPhotosynth ? 5.5 * leafFactor + 1.5 : -1.8;
        const nextAtp = Math.max(5, Math.min(100, s.atp + atpDelta));
        setAtp(Math.round(nextAtp));

        let o2Level = s.speciesId === 'mangrove' && !s.morphAdapted ? 58 - s.climate.o2Penalty : 88 - s.climate.o2Penalty * 0.5;
        if (hasAerenchyma) o2Level = Math.min(98, o2Level + 24);
        setOxygen(Math.max(15, Math.min(100, Math.round(o2Level))));

        if (nextWater < 22 && s.stomataOpen && s.isDaytime) {
          setCauseAlert({
            level: 'warn',
            title: 'Héo sinh lý do thoát hơi nước mạnh!',
            detail: 'Nước giảm dưới 22%: Hãy đóng khí khổng hoặc tăng phân bổ rễ để hút thêm nước!',
          });
        }

        if (nextAtp > 35 && nextWater > 25 && o2Level > 30) {
          const gain = s.stageIdx === 0 ? (nextWater > 45 ? 10 : 3) : 6.5;
          setStageProgress((p) => Math.min(100, Math.round(p + gain)));
        }
      } else {
        // Animal Physiology
        const inWater =
          s.speciesId === 'salmon' ||
          (s.speciesId === 'frog' && (s.stageIdx <= 2 || s.playerPos.y > 0.52));

        // Temperature regulation
        let targetT =
          s.speciesId === 'polar_bear'
            ? 37 + (s.climate.tempBias > 3 && !hasBlubber ? 2.5 : 0)
            : 23 + s.climate.tempBias * 0.8;
        if (hasBlubber && s.speciesId === 'polar_bear') targetT = 37;
        setBodyTemp(Math.round(targetT));

        // Oxygen dynamics (especially frog stage 2->3 gill-to-lung transition!)
        let o2Delta = 1.5;
        if (s.speciesId === 'frog' && s.stageIdx === 2 && s.playerPos.y > 0.48) {
          o2Delta = -6.5; // Must surface because gills are regressing!
        } else if (s.speciesId === 'frog' && s.stageIdx === 3 && s.skinMoist < 35) {
          o2Delta = -4.2; // Dry skin reduces cutaneous respiration!
        } else if (s.climate.id === 'pollution' && !hasOsmoShield) {
          o2Delta = -3.8;
        }
        const nextO2 = Math.max(10, Math.min(100, s.oxygen + o2Delta));
        setOxygen(Math.round(nextO2));

        // Skin moisture & water
        let waterDelta = inWater ? 4.5 : -2.2 * s.climate.waterDrain;
        if (hasMoistSkin) waterDelta += 1.4;
        const nextWater = Math.max(12, Math.min(100, s.water + waterDelta));
        setWater(Math.round(nextWater));
        if (s.speciesId === 'frog') {
          setSkinMoist((m) => Math.max(10, Math.min(100, Math.round(m + (inWater ? 8 : -3 * s.climate.waterDrain)))));
        }

        // ATP burn vs hibernation
        let atpBurn = s.hidingCamo ? -0.9 : -2.2;
        if (hasEffWings) atpBurn *= 0.65;
        const nextAtp = Math.max(5, Math.min(100, s.atp + atpBurn));
        setAtp(Math.round(nextAtp));

        if (s.speciesId === 'frog' && s.stageIdx === 2 && nextO2 < 45) {
          setCauseAlert({
            level: 'warn',
            title: 'Thiếu O₂ khi Nòng nọc mọc chân!',
            detail: 'Mang đang tiêu biến để phổi phát triển: hãy bấm lên mặt nước (nửa trên hồ) để ngoi lên thở ngay!',
          });
        } else if (s.speciesId === 'frog' && s.stageIdx === 3 && s.skinMoist < 40) {
          setCauseAlert({
            level: 'warn',
            title: 'Da Ếch bị khô — suy giảm hô hấp qua da!',
            detail: 'Ếch cần giữ ẩm da liên tục. Hãy xuống nước hoặc bấm nút Giữ ẩm da!',
          });
        }

        if (nextAtp > 35 && nextO2 > 35) {
          setStageProgress((p) => Math.min(100, Math.round(p + (s.stageIdx === 0 || s.stageIdx === 2 ? 9 : 4))));
        }
      }
    }, 900);
    return () => window.clearInterval(timer);
  }, []);

  // 60fps Canvas Renderer (Habitat + Plant/Animal + Interactive X-Ray Biological Overlay)
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = stateRef.current;

      // Update animal smooth movement + foraging collision
      if (s.domain === 'animal' && s.playing) {
        const pt = playerTargetRef.current;
        const dx = pt.x - s.playerPos.x;
        const dy = pt.y - s.playerPos.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.01) {
          const spd = s.stageIdx === 0 ? 0.04 : 0.35;
          const step = Math.min(dist, spd * dt);
          const nx = s.playerPos.x + (dx / dist) * step;
          const ny = s.playerPos.y + (dy / dist) * step;
          s.playerPos.x = nx;
          s.playerPos.y = ny;
        }

        // Move targets & check eating
        const list = targetsRef.current;
        for (let i = 0; i < list.length; i++) {
          const tg = list[i];
          tg.x += tg.vx * dt;
          tg.y += tg.vy * dt;
          if (tg.x < 0.08 || tg.x > 0.92) tg.vx *= -1;
          if (tg.y < 0.16 || tg.y > 0.88) tg.vy *= -1;

          if (Math.hypot(tg.x - s.playerPos.x, tg.y - s.playerPos.y) < 0.065) {
            if (tg.kind === 'food' && s.stageIdx !== 0) {
              tg.x = 0.1 + Math.random() * 0.8;
              tg.y = s.speciesId === 'butterfly' ? 0.2 + Math.random() * 0.55 : 0.48 + Math.random() * 0.35;
              setAtp((a) => Math.min(100, a + 16));
              setStageProgress((p) => Math.min(100, p + 14));
            } else if (tg.kind === 'predator' && !s.hidingCamo) {
              tg.x = tg.x < 0.5 ? 0.88 : 0.12;
              setAtp((a) => Math.max(5, a - 14));
              setCauseAlert({
                level: 'warn',
                title: 'Bị thiên địch tấn công!',
                detail: 'Tiêu hao ATP để trốn chạy! Bật Ngụy trang hoặc di chuyển né tránh thiên địch.',
              });
            }
          }
        }
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
          }
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.scale(dpr, dpr);
            const W = rect.width;
            const H = rect.height;
            const t = now * 0.001;

            // Sky / Atmosphere
            const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
            if (s.xrayMode) {
              skyGrad.addColorStop(0, '#020617');
              skyGrad.addColorStop(1, '#082f49');
            } else if (!s.isDaytime && s.domain === 'plant') {
              skyGrad.addColorStop(0, '#0f172a');
              skyGrad.addColorStop(1, '#1e293b');
            } else if (s.speciesId === 'cactus') {
              skyGrad.addColorStop(0, '#78350f');
              skyGrad.addColorStop(1, '#d97706');
            } else if (s.speciesId === 'polar_bear') {
              skyGrad.addColorStop(0, '#0c4a6e');
              skyGrad.addColorStop(1, '#bae6fd');
            } else {
              skyGrad.addColorStop(0, '#0369a1');
              skyGrad.addColorStop(1, '#0f172a');
            }
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, W, H);

            // Sun / Moon
            if (s.domain === 'plant' && !s.xrayMode) {
              ctx.fillStyle = s.isDaytime ? '#fde047' : '#e2e8f0';
              ctx.beginPath();
              ctx.arc(W * 0.85, H * 0.16, 24, 0, Math.PI * 2);
              ctx.fill();
            }

            // Habitat Ground or Water line
            const surfaceY = H * 0.48;
            if (s.domain === 'animal' && (s.speciesId === 'frog' || s.speciesId === 'salmon')) {
              ctx.fillStyle = s.xrayMode ? 'rgba(14, 116, 144, 0.25)' : 'rgba(14, 165, 233, 0.34)';
              ctx.fillRect(0, surfaceY, W, H - surfaceY);
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 2;
              ctx.beginPath();
              for (let x = 0; x <= W; x += 16) {
                const wy = surfaceY + Math.sin(x * 0.03 + t * 2) * 3;
                if (x === 0) ctx.moveTo(x, wy);
                else ctx.lineTo(x, wy);
              }
              ctx.stroke();
            } else {
              const groundY = H * 0.72;
              ctx.fillStyle =
                s.speciesId === 'polar_bear'
                  ? '#e2e8f0'
                  : s.speciesId === 'cactus'
                  ? '#92400e'
                  : s.speciesId === 'mangrove'
                  ? '#292524'
                  : '#3f2e1d';
              ctx.fillRect(0, groundY, W, H - groundY);
            }

            if (s.domain === 'plant') {
              const cx = W * 0.42;
              const groundY = H * 0.72;
              const growScale = 0.4 + s.stageIdx * 0.22 + (s.stageProgress / 100) * 0.15;
              const stemH = (120 * growScale * (100 - s.rootAlloc * 0.45)) / 80;
              const rootDepth = (75 * growScale * (40 + s.rootAlloc * 0.8)) / 90;

              // Roots underground
              ctx.strokeStyle = s.xrayMode ? '#38bdf8' : '#d6d3d1';
              ctx.lineWidth = s.xrayMode ? 3.5 : 2.5;
              for (let r = -2; r <= 2; r++) {
                ctx.beginPath();
                ctx.moveTo(cx, groundY);
                ctx.quadraticCurveTo(cx + r * 18, groundY + rootDepth * 0.5, cx + r * 28, groundY + rootDepth);
                ctx.stroke();
              }

              // Mangrove prop roots & pneumatophores
              if (s.speciesId === 'mangrove' && (s.morphAdapted || s.stageIdx >= 1)) {
                ctx.strokeStyle = '#a8a29e';
                ctx.lineWidth = 4;
                [-38, -20, 20, 38].forEach((off) => {
                  ctx.beginPath();
                  ctx.moveTo(cx, groundY - 26);
                  ctx.lineTo(cx + off, groundY + 12);
                  ctx.stroke();
                });
                // Breathing roots sticking up
                ctx.strokeStyle = '#34d399';
                ctx.lineWidth = 3;
                [-56, -44, 48, 62].forEach((off) => {
                  ctx.beginPath();
                  ctx.moveTo(cx + off, groundY + 12);
                  ctx.lineTo(cx + off, groundY - 22);
                  ctx.stroke();
                });
              }

              // Stem (phototropism curve toward sun on right when bean)
              const leanX = s.speciesId === 'bean' && s.isDaytime ? 22 : 0;
              ctx.strokeStyle = s.speciesId === 'cactus' ? '#15803d' : '#22c55e';
              ctx.lineWidth = s.speciesId === 'cactus' ? 28 : 8;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(cx, groundY);
              ctx.quadraticCurveTo(cx + leanX * 0.4, groundY - stemH * 0.5, cx + leanX, groundY - stemH);
              ctx.stroke();

              // Leaves or Cactus Spines
              if (s.stageIdx >= 1 && s.speciesId !== 'cactus') {
                ctx.fillStyle = s.water < 25 ? '#eab308' : '#22c55e';
                [-1, 1].forEach((side) => {
                  ctx.beginPath();
                  ctx.ellipse(
                    cx + leanX * 0.6 + side * 28,
                    groundY - stemH * 0.65,
                    22,
                    11,
                    side * 0.4,
                    0,
                    Math.PI * 2
                  );
                  ctx.fill();
                });
              } else if (s.speciesId === 'cactus' && (s.morphAdapted || s.stageIdx >= 2)) {
                ctx.strokeStyle = '#fef08a';
                ctx.lineWidth = 1.5;
                for (let y = 18; y < stemH; y += 16) {
                  ctx.beginPath();
                  ctx.moveTo(cx - 14, groundY - y);
                  ctx.lineTo(cx - 24, groundY - y - 5);
                  ctx.moveTo(cx + 14, groundY - y);
                  ctx.lineTo(cx + 24, groundY - y - 5);
                  ctx.stroke();
                }
              }

              // Flower in stage 3
              if (s.stageIdx === 3) {
                ctx.fillStyle = s.pollinated ? '#f59e0b' : '#f472b6';
                for (let k = 0; k < 5; k++) {
                  const a = (k / 5) * Math.PI * 2 + t * 0.4;
                  ctx.beginPath();
                  ctx.arc(cx + leanX + Math.cos(a) * 11, groundY - stemH - 6 + Math.sin(a) * 11, 7, 0, Math.PI * 2);
                  ctx.fill();
                }
                ctx.fillStyle = '#fde047';
                ctx.beginPath();
                ctx.arc(cx + leanX, groundY - stemH - 6, 6, 0, Math.PI * 2);
                ctx.fill();
              }

              // X-RAY Biological Cutaway Overlay (Stomata Zoom + Vascular Xylem/Phloem Flow)
              if (s.xrayMode) {
                // Animated Xylem Water upward flow
                for (let i = 0; i < 8; i++) {
                  const f = (t * 0.7 + i / 8) % 1;
                  ctx.fillStyle = '#38bdf8';
                  ctx.beginPath();
                  ctx.arc(cx + leanX * f, groundY + rootDepth * (1 - f) - stemH * f, 3.5, 0, Math.PI * 2);
                  ctx.fill();
                }

                // Zoomed Leaf Stomata Cross-Section Box on Right
                const bx = W * 0.6;
                const by = H * 0.14;
                const bw = Math.min(260, W * 0.36);
                const bh = 165;
                ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
                ctx.strokeStyle = s.xrayStomataZoom ? '#f59e0b' : '#38bdf8';
                ctx.lineWidth = 2;
                ctx.fillRect(bx, by, bw, bh);
                ctx.strokeRect(bx, by, bw, bh);

                ctx.fillStyle = '#e2e8f0';
                ctx.font = 'bold 11px sans-serif';
                ctx.fillText('X-RAY: LỖ KHÍ KHỔNG & MẠCH DẪN', bx + 12, by + 20);

                // Two Guard cells
                const gap = s.stomataOpen ? 16 : 3;
                ctx.fillStyle = '#16a34a';
                ctx.beginPath();
                ctx.ellipse(bx + bw / 2 - gap - 18, by + 88, 18, 32, 0, 0, Math.PI * 2);
                ctx.ellipse(bx + bw / 2 + gap + 18, by + 88, 18, 32, 0, 0, Math.PI * 2);
                ctx.fill();

                if (s.stomataOpen) {
                  // Escaping H2O vapor particles
                  const steamRate = s.isDaytime ? 8 : 3;
                  for (let p = 0; p < steamRate; p++) {
                    const ph = (t * 1.4 + p / steamRate) % 1;
                    ctx.fillStyle = `rgba(56, 189, 248, ${(1 - ph).toFixed(2)})`;
                    ctx.beginPath();
                    ctx.arc(bx + bw / 2 + Math.sin(p * 2 + t) * 14, by + 85 - ph * 48, 3.5, 0, Math.PI * 2);
                    ctx.fill();
                  }
                  ctx.fillStyle = '#38bdf8';
                  ctx.font = 'bold 10px monospace';
                  ctx.fillText('H₂O ↑ Thoát hơi', bx + 12, by + 148);
                  ctx.fillStyle = '#4ade80';
                  ctx.fillText('CO₂ ↓ Quang hợp', bx + bw - 108, by + 148);
                } else {
                  ctx.fillStyle = '#fbbf24';
                  ctx.font = 'bold 11px sans-serif';
                  ctx.fillText('Khí khổng ĐÓNG — Giữ nước tối đa', bx + 18, by + 148);
                }
              }
            } else {
              // ANIMAL ROLEPLAY RENDERING
              // Food & Predator targets
              targetsRef.current.forEach((tg) => {
                const tx = tg.x * W;
                const ty = tg.y * H;
                if (tg.kind === 'food') {
                  ctx.fillStyle = '#4ade80';
                  ctx.beginPath();
                  ctx.arc(tx, ty, 6, 0, Math.PI * 2);
                  ctx.fill();
                } else {
                  ctx.fillStyle = '#fb7185';
                  ctx.beginPath();
                  ctx.moveTo(tx + 12, ty);
                  ctx.lineTo(tx - 10, ty - 7);
                  ctx.lineTo(tx - 10, ty + 7);
                  ctx.closePath();
                  ctx.fill();
                }
              });

              const px = s.playerPos.x * W;
              const py = s.playerPos.y * H;
              const radius = 16 + s.stageIdx * 4;

              ctx.save();
              ctx.globalAlpha = s.hidingCamo ? 0.45 : 1;
              ctx.fillStyle =
                s.speciesId === 'polar_bear'
                  ? '#f8fafc'
                  : s.speciesId === 'salmon'
                  ? '#f97316'
                  : s.speciesId === 'butterfly'
                  ? '#facc15'
                  : '#22c55e';
              ctx.strokeStyle = s.xrayMode ? '#38bdf8' : '#0f172a';
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.ellipse(px, py, radius * 1.25, radius * 0.85, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              // Tadpole / Salmon tail
              if (s.speciesId === 'salmon' || (s.speciesId === 'frog' && (s.stageIdx === 1 || s.stageIdx === 2))) {
                const wag = Math.sin(t * 8) * 6;
                ctx.strokeStyle = '#86efac';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(px - radius, py);
                ctx.lineTo(px - radius - 18, py + wag);
                ctx.stroke();
              }
              ctx.restore();

              // X-RAY INTERNAL ANATOMY OVERLAY FOR ANIMAL
              if (s.xrayMode) {
                // Pulsing Heart
                const beat = 1 + Math.sin(t * 7) * 0.25;
                ctx.fillStyle = '#e11d48';
                ctx.beginPath();
                ctx.arc(px + 4, py, 5 * beat, 0, Math.PI * 2);
                ctx.fill();

                // Respiratory Organ Cutaway (Gills vs Lungs!)
                if (s.speciesId === 'frog' && s.stageIdx >= 2) {
                  ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
                  ctx.beginPath();
                  ctx.ellipse(px - 4, py - 5, 6, 4, 0, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.fillStyle = '#e0f2fe';
                  ctx.font = 'bold 10px monospace';
                  ctx.fillText(
                    s.stageIdx === 2 ? 'X-RAY: Mang tiêu biến → Phổi mở' : 'X-RAY: Phổi + Thở qua da ẩm',
                    px - 58,
                    py - radius - 10
                  );
                } else {
                  ctx.fillStyle = '#38bdf8';
                  ctx.font = 'bold 10px monospace';
                  ctx.fillText(`X-RAY: ATP ${s.atp}% | O₂ ${s.oxygen}%`, px - 52, py - radius - 10);
                }
              }
            }

            ctx.restore();
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (domain !== 'animal') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = Math.max(0.06, Math.min(0.94, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0.16, Math.min(0.88, (e.clientY - rect.top) / rect.height));
    playerTargetRef.current = { x: nx, y: ny };
  };

  const activeStage = species.stages[stageIdx];

  return (
    <div className="space-y-4">
      {/* Top Role Selector + Climate + X-Ray Switch */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setDomain('plant');
                resetRun('bean');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                domain === 'plant'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>1. Nhập vai Thực vật (3 loài)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDomain('animal');
                resetRun('frog');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                domain === 'animal'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>2. Nhập vai Động vật (4 loài)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setXrayMode((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap border ${
                xrayMode
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-cyan-300 border-cyan-500/40'
              }`}
            >
              <ScanEye className="w-4 h-4" />
              <span>{xrayMode ? 'X-Ray Sinh học: ĐANG BẬT' : 'Mở Góc nhìn X-Ray'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{playing ? 'Tạm dừng' : 'Chạy'}</span>
            </button>
            <button
              type="button"
              onClick={() => resetRun(speciesId)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Bắt đầu lại vòng đời"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Species Picker inside chosen Domain */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-1.5">
            {SPECIES_LIST.filter((sp) => sp.domain === domain).map((sp) => (
              <button
                key={sp.id}
                type="button"
                onClick={() => resetRun(sp.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                  speciesId === sp.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                {sp.nameVi}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Môi trường thử thách:</span>
            {CLIMATES.map((cl) => (
              <button
                key={cl.id}
                type="button"
                onClick={() => setClimateId(cl.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  climateId === cl.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cl.nameVi}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Viewport + Physiological Status + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Simulation Canvas & Physiological Gauges */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className={`w-full h-[360px] sm:h-[420px] block ${domain === 'animal' ? 'cursor-crosshair' : 'cursor-default'}`}
          />

          {/* 4 Physiological Telemetry Gauges (Replaces HP!) */}
          <div className="border-t border-slate-800 bg-slate-900 p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-slate-100">
            <div className="rounded-lg border border-slate-800 bg-slate-950/75 p-2.5">
              <div className="text-[11px] text-slate-400 flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Năng lượng ATP</div>
              <div className="text-lg font-mono font-extrabold tabular-nums text-amber-400">{atp}%</div>
              <div className="h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
                <div className="h-full bg-amber-400 transition-all" style={{ width: `${atp}%` }} />
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/75 p-2.5">
              <div className="text-[11px] text-slate-400 flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-sky-400" /> Lượng nước</div>
              <div className="text-lg font-mono font-extrabold tabular-nums text-sky-400">{water}%</div>
              <div className="h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
                <div className="h-full bg-sky-400 transition-all" style={{ width: `${water}%` }} />
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/75 p-2.5">
              <div className="text-[11px] text-slate-400 flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-rose-400" /> Nhiệt cơ thể</div>
              <div className="text-lg font-mono font-extrabold tabular-nums text-rose-400">{bodyTemp}°C</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">{climate.nameVi}</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/75 p-2.5">
              <div className="text-[11px] text-slate-400 flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-emerald-400" /> Nồng độ O₂</div>
              <div className="text-lg font-mono font-extrabold tabular-nums text-emerald-400">{oxygen}%</div>
              <div className="h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all" style={{ width: `${oxygen}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Lifecycle Stage, Roleplay Actions & Cause-Effect Diagnostic */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
          {/* Current Lifecycle Stage Card */}
          <div className="rounded-xl border border-teal-500/35 bg-teal-500/10 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-teal-700 dark:text-teal-300 uppercase">
                Giai đoạn {stageIdx + 1}/4
              </span>
              <span className="font-mono font-bold tabular-nums text-teal-700 dark:text-teal-300">
                Tiến độ: {stageProgress}%
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{activeStage.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">{activeStage.bioFocus}</p>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-teal-600 transition-all" style={{ width: `${stageProgress}%` }} />
            </div>
            <button
              type="button"
              disabled={stageProgress < 100}
              onClick={advanceStageOrFinish}
              className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-45 text-white text-xs font-extrabold cursor-pointer"
            >
              {stageIdx < 3
                ? stageProgress >= 100
                  ? 'Tiến hóa sang Giai đoạn tiếp theo →'
                  : `Đang tích lũy (${activeStage.goalText})`
                : stageProgress >= 100
                ? 'Hoàn tất Vòng đời & Mở khóa Thẻ Tính trạng ★'
                : `Hoàn thiện giai đoạn cuối (${activeStage.goalText})`}
            </button>
          </div>

          {/* Domain-specific Physiology / Behavior Controls */}
          {domain === 'plant' ? (
            <div className="space-y-3 text-xs">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsDaytime((d) => !d)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    isDaytime ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  {isDaytime ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDaytime ? 'Ban ngày (Nắng)' : 'Ban đêm (Mát)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleStomata(true)}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    stomataOpen
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Mở khí khổng
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleStomata(false)}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                    !stomataOpen
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Đóng khí khổng
                </button>
              </div>

              <label className="block space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Phân bổ ATP: Rễ ({rootAlloc}%) ↔ Thân &amp; Lá ({100 - rootAlloc}%)</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={85}
                  value={rootAlloc}
                  onChange={(e) => setRootAlloc(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </label>

              <button
                type="button"
                onClick={handleSpecialAction}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{stageIdx === 3 ? 'Thực hiện Thụ phấn & Tạo hạt' : species.specialActionLabel}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 text-xs">
              <div className="rounded-lg bg-slate-100 dark:bg-slate-800/70 p-2.5 text-slate-700 dark:text-slate-300">
                Nhấp trực tiếp vào màn hình mô phỏng để di chuyển, ăn điểm xanh (+ATP) và tránh tam giác đỏ (Thiên địch).
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSpecialAction}
                  className="py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold cursor-pointer"
                >
                  {speciesId === 'frog' && stageIdx === 2
                    ? 'Ngoi lên mặt nước thở'
                    : species.specialActionLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setHidingCamo((h) => !h)}
                  className={`py-2 px-3 rounded-lg font-bold cursor-pointer border ${
                    hidingCamo
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {hidingCamo ? 'Đang Ngụy trang / Lẩn trốn' : 'Bật Ngụy trang tránh địch'}
                </button>
              </div>
            </div>
          )}

          {/* Cause & Effect Explanation Box */}
          <div
            className={`rounded-xl border p-3 text-xs space-y-1 ${
              causeAlert.level === 'warn'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-900 dark:text-amber-200'
                : causeAlert.level === 'ok'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                : 'bg-sky-500/10 border-sky-500/30 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="font-extrabold flex items-center gap-1.5">
              {causeAlert.level === 'warn' ? (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
              <span>{causeAlert.title}</span>
            </div>
            <p className="leading-relaxed opacity-90">{causeAlert.detail}</p>
          </div>
        </div>
      </div>

      {/* Evolution Trait Tree Strip */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Cây Tiến hóa &amp; Thẻ Tính trạng ({unlockedTraits.length}/{TRAIT_CARDS.length} đã mở khóa · {lifecycleCompletedCount} vòng đời)</span>
          </div>
          <span className="text-[11px] text-slate-500">Hoàn thành vòng đời để mở khóa — hoặc nhấp thẻ đã mở để trang bị</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2">
          {TRAIT_CARDS.map((card) => {
            const unlocked = unlockedTraits.includes(card.id);
            const active = activeTraits.includes(card.id);
            return (
              <button
                key={card.id}
                type="button"
                disabled={!unlocked}
                onClick={() => toggleTrait(card.id)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-colors ${
                  !unlocked
                    ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800'
                    : active
                    ? 'bg-emerald-600/15 border-emerald-500 ring-1 ring-emerald-500 cursor-pointer'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-teal-400 cursor-pointer'
                }`}
              >
                <div className="font-bold text-slate-900 dark:text-white truncate">{card.nameVi}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{card.effectVi}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
