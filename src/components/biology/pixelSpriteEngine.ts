// Crisp Pixel-Art Sprite Engine for Biology Animals & Plants ONLY.
// Offscreen-caches integer-grid pixel matrices and draws them with imageSmoothingEnabled = false
// so main organisms stay razor-sharp pixel art while surrounding lighting/shaders remain silky smooth.

export type PixelPalette = Record<string, string>;

export interface PixelSpriteSpec {
  grid: string[]; // Each string row uses characters mapped in palette ('.' = transparent)
  palette: PixelPalette;
}

const spriteCache = new Map<string, HTMLCanvasElement>();

function getOrCreateSpriteCanvas(key: string, spec: PixelSpriteSpec): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const cached = spriteCache.get(key);
  if (cached) return cached;

  const h = spec.grid.length;
  const w = spec.grid[0]?.length || 1;
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const octx = off.getContext('2d');
  if (!octx) return null;

  for (let y = 0; y < h; y++) {
    const row = spec.grid[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const col = spec.palette[ch];
      if (!col) continue;
      octx.fillStyle = col;
      octx.fillRect(x, y, 1, 1);
    }
  }
  spriteCache.set(key, off);
  return off;
}

export function drawPixelSprite(
  ctx: CanvasRenderingContext2D,
  key: string,
  spec: PixelSpriteSpec,
  cx: number,
  cy: number,
  pixelScale: number,
  opts?: {
    flipX?: boolean;
    anchorBottom?: boolean;
    alpha?: number;
    rotationRad?: number;
    xrayGlowColor?: string;
  }
) {
  const off = getOrCreateSpriteCanvas(key, spec);
  if (!off) return;

  const drawW = Math.round(off.width * pixelScale);
  const drawH = Math.round(off.height * pixelScale);

  ctx.save();
  if (opts?.alpha !== undefined) ctx.globalAlpha *= opts.alpha;
  ctx.translate(Math.round(cx), Math.round(cy));
  if (opts?.rotationRad) ctx.rotate(opts.rotationRad);
  if (opts?.flipX) ctx.scale(-1, 1);

  if (opts?.xrayGlowColor) {
    ctx.shadowColor = opts.xrayGlowColor;
    ctx.shadowBlur = 14;
  }

  const prevSmooth = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  const dx = -Math.round(drawW / 2);
  const dy = opts?.anchorBottom ? -drawH : -Math.round(drawH / 2);
  ctx.drawImage(off, dx, dy, drawW, drawH);
  ctx.imageSmoothingEnabled = prevSmooth;
  ctx.restore();
}

// Helper to convert a PixelSpriteSpec into crisp SVG <rect> elements for React SVG previews
export function spriteSpecToSvgRects(spec: PixelSpriteSpec): { x: number; y: number; fill: string }[] {
  const out: { x: number; y: number; fill: string }[] = [];
  for (let y = 0; y < spec.grid.length; y++) {
    const row = spec.grid[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const fill = spec.palette[ch];
      if (fill) out.push({ x, y, fill });
    }
  }
  return out;
}

// ============================================================================
// TERRARIUM & ECOLOGY PIXEL SPRITES (ANIMALS & PLANTS)
// ============================================================================

export function getTerrariumPlantSpec(biome: 'pond' | 'rainforest' | 'desert', variant = 0): PixelSpriteSpec {
  if (biome === 'pond') {
    return {
      palette: {
        O: '#064e3b',
        G: '#10b981',
        L: '#34d399',
        H: '#a7f3d0',
        P: '#f472b6',
        Y: '#fde047',
      },
      grid:
        variant % 2 === 0
          ? [
              '......PPP.......',
              '.....PYYYP......',
              '......PPP.......',
              '...OOOGGGGOOO...',
              '..OLLLGGGGLLLO..',
              '.OLLGGGGGGGGLLO.',
              '..OOOOOOOOOOOO..',
              '......OGGO......',
              '.....OG..GO.....',
              '....OG.OG.GO....',
              '....OG.OG.GO....',
              '....LO.LG.OL....',
              '.....G.OG.G.....',
              '.....O.GO.O.....',
            ]
          : [
              '....OO....OO....',
              '...OGLO..OLGO...',
              '...OGGO..OGGO...',
              '..OGGO....OGGO..',
              '..OGLO.OO.OLGO..',
              '..OGGOGLLGOGGO..',
              '...OGGOGGOGGO...',
              '...OGGOGGOGGO...',
              '....OGOGGOGO....',
              '....OGOGGOGO....',
              '.....OGGOGO.....',
              '.....OOOOOO.....',
            ],
    };
  }
  if (biome === 'desert') {
    return {
      palette: {
        O: '#14532d',
        G: '#16a34a',
        L: '#4ade80',
        S: '#fef08a',
        F: '#fb7185',
        Y: '#fde047',
      },
      grid: [
        '.....FFYFF......',
        '......OOO.......',
        '.....OGLLO......',
        '.OO..OGLLO..OO..',
        'OGLO.OGLLO.OGLO.',
        'OGGO.OGLLO.OGGO.',
        'OGGOOOGLLO.OGGO.',
        'OGGGOOGLLOOGGGO.',
        '.OOOOOGLLOOOOO..',
        '.....OGLLO......',
        '....SOGLLOS.....',
        '.....OGLLO......',
        '....SOGLLOS.....',
        '.....OGLLO......',
        '.....OOOOO......',
      ],
    };
  }
  // rainforest
  return {
    palette: {
      O: '#052e16',
      D: '#15803d',
      G: '#22c55e',
      L: '#86efac',
      B: '#78350f',
      T: '#92400e',
      F: variant % 2 === 0 ? '#fb7185' : '#fde047',
    },
    grid: [
      '.....OOOOOO.....',
      '...OOGLLLLGOO...',
      '..OGGLLLLLLGGO..',
      '.ODGGGFFFFGGGDO.',
      '.ODGGGGGGGGGGDO.',
      '..OODGGGGGGDOO..',
      '...OOOGGGGOOO...',
      '.....OOBBOO.....',
      '..OO..OBTO..OO..',
      '.OGLO.OBTO.OLGO.',
      '..OO..OBTO..OO..',
      '......OBTO......',
      '......OBTO......',
      '.....OOBBOO.....',
    ],
  };
}

export function getTerrariumHerbivoreSpec(biome: 'pond' | 'rainforest' | 'desert', frame: number): PixelSpriteSpec {
  if (biome === 'pond') {
    // Detailed pixel freshwater fish (2 swim tail frames)
    const f = frame % 2;
    return {
      palette: {
        O: '#0c4a6e',
        B: '#0284c7',
        L: '#38bdf8',
        H: '#bae6fd',
        G: '#fbbf24',
        W: '#ffffff',
        E: '#0f172a',
      },
      grid:
        f === 0
          ? [
              '......OOOO......',
              '....OOBLLLOO....',
              '..OOLLLLLLLLOO..',
              '.OGOBLHHHHLEWLO.',
              'OGGOLHHHHHHHHLO.',
              'OGGOLBBBBBBBBBO.',
              '.OGOBBBBBLLBOO..',
              '...OOBBBBOOO....',
              '.....OOOO.......',
            ]
          : [
              '......OOOO......',
              '....OOBLLLOO....',
              'O.OOLLLLLLLLOO..',
              'OGGOBLHHHHLEWLO.',
              '.OGOLHHHHHHHHLO.',
              'OGGOBBBBBBBBBBO.',
              'O.OOBBBBBLLBOO..',
              '...OOBBBBOOO....',
              '.....OOOO.......',
            ],
    };
  }
  if (biome === 'desert') {
    // Detailed pixel desert tortoise / hare
    const f = frame % 2;
    return {
      palette: {
        O: '#451a03',
        S: '#b45309',
        L: '#f59e0b',
        H: '#fde68a',
        G: '#65a30d',
        E: '#0f172a',
      },
      grid:
        f === 0
          ? [
              '....OOOOOO......',
              '..OOHLLLLLOO....',
              '.OHLLLSSLLLLOO..',
              '.OLLSSSSSSLLOGO.',
              'OSSSSSSSSSSOGEO.',
              'OOOOOOOOOOOOOGO.',
              '..OSSO..OSSO....',
              '..OOO....OOO....',
            ]
          : [
              '....OOOOOO......',
              '..OOHLLLLLOO....',
              '.OHLLLSSLLLLOO..',
              '.OLLSSSSSSLLOGO.',
              'OSSSSSSSSSSOGEO.',
              'OOOOOOOOOOOOOGO.',
              '...OSSO..OSSO...',
              '...OOO....OOO...',
            ],
    };
  }
  // rainforest: forest rabbit (2 hop frames)
  const f = frame % 2;
  return {
    palette: {
      O: '#451a03',
      F: '#f59e0b',
      L: '#fde68a',
      W: '#ffffff',
      P: '#fb7185',
      E: '#0f172a',
    },
    grid:
      f === 0
        ? [
            '.......OO.OO....',
            '......OLOOLO....',
            '......OLOOLO....',
            '....OOFFFFFFOO..',
            '..OOFFFFFFFFLEO.',
            '.OWOFFFFFFFFFPO.',
            '.OOFFFFLLLLFFOO.',
            '..OFFFFLLLLFFO..',
            '..OFOOO..OOFO...',
            '..OO......OO....',
          ]
        : [
            '......OO.OO.....',
            '.....OLOOLO.....',
            '.....OLOOLO.....',
            '...OOFFFFFFOO...',
            '.OOFFFFFFFFLEO..',
            'OWOFFFFFFFFFPO..',
            '.OOFFFFLLLLFFOO.',
            '..OFFFFLLLLFFO..',
            '.OFO......OFO...',
            '.OO........OO...',
          ],
  };
}

export function getTerrariumCarnivoreSpec(biome: 'pond' | 'rainforest' | 'desert', frame: number): PixelSpriteSpec {
  if (biome === 'pond') {
    // Pixel pike / predator fish
    const f = frame % 2;
    return {
      palette: {
        O: '#4c0519',
        R: '#e11d48',
        L: '#fb7185',
        D: '#881337',
        W: '#ffffff',
        Y: '#fde047',
        E: '#0f172a',
      },
      grid:
        f === 0
          ? [
              '......OOOOO.......',
              '....OORRRRROO.....',
              'O..ORRRRRRRRROOO..',
              'OROORLLLLLLRREYYO.',
              'ORRRRRRRRRRRRRWWO.',
              'ORRODDDDDDDRRRRO..',
              'O..OODDDDDDROOO...',
              '.....OOOOOOO......',
            ]
          : [
              '......OOOOO.......',
              '....OORRRRROO.....',
              '.OORRRRRRRRRROOO..',
              'ORROORLLLLLRREYYO.',
              'ORRRRRRRRRRRRRWWO.',
              'ORRODDDDDDDRRRRO..',
              '.OO.OODDDDDROOO...',
              '.....OOOOOOO......',
            ],
    };
  }
  if (biome === 'desert') {
    // Desert fennec / jackal predator
    const f = frame % 2;
    return {
      palette: {
        O: '#431407',
        R: '#ea580c',
        L: '#fdba74',
        W: '#fff7ed',
        E: '#0f172a',
      },
      grid:
        f === 0
          ? [
              '........OOO.OOO.',
              '.......ORLOROLO.',
              '.......ORRORRO..',
              '..OOO..ORRRRREO.',
              '.ORRLOORRRRRRRO.',
              'ORRROORLLLLRRRO.',
              '.OOO.ORRRRRRRO..',
              '.....ORO...ORO..',
              '.....OO.....OO..',
            ]
          : [
              '........OOO.OOO.',
              '.......ORLOROLO.',
              '.......ORRORRO..',
              '..OOO..ORRRRREO.',
              '.ORRLOORRRRRRRO.',
              'ORRROORLLLLRRRO.',
              '.OOO.ORRRRRRRO..',
              '....ORO.....ORO.',
              '....OO.......OO.',
            ],
    };
  }
  // rainforest: jungle fox / lynx
  const f = frame % 2;
  return {
    palette: {
      O: '#4c0519',
      R: '#f43f5e',
      A: '#fb923c',
      W: '#ffffff',
      E: '#0f172a',
    },
    grid:
      f === 0
        ? [
            '........OO..OO..',
            '.......OAO..OAO.',
            '.......OARROARO.',
            '.OOO..OARRRRREO.',
            'OAAAOORRRRRRRRO.',
            'OWAAOORWWWRRRRO.',
            '.OOOOORRRRRRRO..',
            '.....ORRO..ORRO.',
            '.....OOO....OOO.',
          ]
        : [
            '........OO..OO..',
            '.......OAO..OAO.',
            '.......OARROARO.',
            '.OOO..OARRRRREO.',
            'OAAAOORRRRRRRRO.',
            'OWAAOORWWWRRRRO.',
            '.OOOOORRRRRRRO..',
            '....ORRO....ORRO',
            '....OOO......OOO',
          ],
  };
}

export function getTerrariumDecomposerSpec(biome: 'pond' | 'rainforest' | 'desert'): PixelSpriteSpec {
  if (biome === 'pond') {
    return {
      palette: { O: '#3b0764', P: '#a855f7', L: '#e9d5ff', S: '#7e22ce', E: '#0f172a' },
      grid: [
        '...OOOOO....',
        '..OPLLLPO...',
        '.OPLSSSLPO..',
        '.OPLSPSLPO..',
        '..OSSSSSOO..',
        '.OOPPPPPPEO.',
        'OOOOOOOOOOO.',
      ],
    };
  }
  if (biome === 'desert') {
    return {
      palette: { O: '#451a03', B: '#b45309', G: '#fbbf24', L: '#fef08a' },
      grid: [
        '..O..OO..O..',
        '..OOBBBOO...',
        '.OBBLLLBBO..',
        'OOBBGGGBBOO.',
        '.OBBBBBBBBO.',
        '..O.OOOO.O..',
      ],
    };
  }
  // glowing mushroom
  return {
    palette: { O: '#3b0764', P: '#9333ea', L: '#d8b4fe', W: '#f8fafc', S: '#cbd5e1' },
    grid: [
      '...OOOOOO...',
      '..OPPLLPPPO.',
      '.OPWPPPPWPO.',
      '.OPPPPPPPPO.',
      '..OOOOOOOO..',
      '....OWSO....',
      '....OWSO....',
      '...OOWSOO...',
    ],
  };
}

// ============================================================================
// ORGANISM ROLEPLAY PIXEL SPRITES (ALL SPECIES x 4 STAGES + FOOD + PREDATOR)
// ============================================================================

export function getAnimalRoleplaySprite(
  species: 'frog' | 'butterfly' | 'salmon' | 'polar_bear',
  stageIdx: number,
  frame: number
): PixelSpriteSpec {
  const f = frame % 2;

  if (species === 'frog') {
    if (stageIdx === 0) {
      return {
        palette: { O: '#0284c7', J: '#7dd3fc', H: '#e0f2fe', N: '#0f172a' },
        grid: [
          '...OOOO..OOOO...',
          '..OJHHJOJHHJJO..',
          '.OJHNNJOJHHNNJO.',
          '.OJJHHJOOJJHHJO.',
          '..OOOOJHHJOOOO..',
          '...OOJHHNNJOO...',
          '....OOJJJJOO....',
          '......OOOO......',
        ],
      };
    }
    if (stageIdx === 1) {
      // Tadpole
      return {
        palette: { O: '#052e16', D: '#166534', G: '#22c55e', L: '#86efac', W: '#ffffff', E: '#0f172a' },
        grid:
          f === 0
            ? [
                '.........OOOOOO..',
                '.......OOGGGGGGO.',
                'OOOO..OGGLLLGEWO.',
                '.ODDOOGGGGGGGGGO.',
                '...OOOGGDDDDGGO..',
                '......OOOOOOO....',
              ]
            : [
                '.........OOOOOO..',
                '...OO..OOGGGGGGO.',
                '..ODDOOGGLLLGEWO.',
                '...OOOGGGGGGGGGO.',
                '.....OOGDDDDGGO..',
                '......OOOOOOO....',
              ],
      };
    }
    if (stageIdx === 2) {
      // Froglet with hind legs
      return {
        palette: { O: '#052e16', G: '#22c55e', L: '#86efac', Y: '#fef08a', E: '#0f172a', W: '#ffffff' },
        grid:
          f === 0
            ? [
                '.........OOOOOO..',
                '.......OOGLLLEWO.',
                '..OO..OGGGGGGGGO.',
                '.OGGOOGGGYYYYGGO.',
                '..OOOGGGOOOOOOO..',
                '....OGGO.........',
              ]
            : [
                '.........OOOOOO..',
                '.......OOGLLLEWO.',
                '....OOOGGGGGGGGO.',
                '..OGGOGGGYYYYGGO.',
                '..OOOGGGOOOOOOO..',
                '...OGGO..........',
              ],
      };
    }
    // Adult Frog (stage 3)
    return {
      palette: { O: '#052e16', G: '#22c55e', D: '#15803d', L: '#86efac', Y: '#fef08a', W: '#ffffff', E: '#0f172a' },
      grid:
        f === 0
          ? [
              '.......OOO..OOO..',
              '......OEOO..OEWO.',
              '.....OGGGGGGGGGO.',
              '...OOGGLLLLGGGGO.',
              '..OGGGGGGYYYYGGO.',
              '.OGDGGGGGGGGGGDO.',
              '.OGDO.OOO..OOGDO.',
              'OOOO........OOOO.',
            ]
          : [
              '......OOO..OOO...',
              '.....OEOO..OEWO..',
              '....OGGGGGGGGGO..',
              '..OOGGLLLLGGGGO..',
              '.OGGGGGGYYYYGGO..',
              'OGDGGGGGGGGGGDO..',
              'OGDO.OOO..OOGDO..',
              'OOO.........OOO..',
            ],
    };
  }

  if (species === 'butterfly') {
    if (stageIdx === 0) {
      return {
        palette: { O: '#14532d', G: '#22c55e', L: '#86efac', Y: '#fef08a', W: '#ffffff' },
        grid: [
          '....OOOOOO....',
          '..OOGGGGGGOO..',
          '.OGLLWYYWLLGO.',
          '.OGGWWYYWWGGO.',
          '..OOGGGGGGOO..',
          '....OOOOOO....',
        ],
      };
    }
    if (stageIdx === 1) {
      // Caterpillar
      return {
        palette: { O: '#0f172a', G: '#22c55e', Y: '#facc15', W: '#f8fafc', E: '#0f172a' },
        grid:
          f === 0
            ? [
                '............OO..',
                '..OOO..OOO.OGYO.',
                '.OGYYOOGYYOGGYO.',
                'OGYWWOGYWWOGYEO.',
                '.OOOOOOOOOOOOOO.',
              ]
            : [
                '............OO..',
                '...OOO..OO.OGYO.',
                '..OGYYOGYYOGGYO.',
                '.OGYWWOGYWOGYEO.',
                '..OOOOOOOOOOOOO.',
              ],
      };
    }
    if (stageIdx === 2) {
      // Chrysalis
      return {
        palette: { O: '#064e3b', B: '#78350f', G: '#10b981', L: '#6ee7b7', Y: '#fde047' },
        grid: [
          '....OO....',
          '...OBBO...',
          '..OOGGOO..',
          '.OGYYYYGO.',
          '.OGLLLLGO.',
          '.OGGGGGGO.',
          '..OGGGGO..',
          '...OGGO...',
          '....OO....',
        ],
      };
    }
    // Monarch/Morpho Butterfly (2 flap frames!)
    return {
      palette: { O: '#0f172a', A: '#f97316', Y: '#fde047', W: '#ffffff', C: '#38bdf8' },
      grid:
        f === 0
          ? [
              '.OOOO......OOOO.',
              'OAAAAO....OAAAAO',
              'OAAYYAO..OAYYAAO',
              'OAAWWAOOOOAWWAAO',
              '.OAAAAOOOOAAAAO.',
              '..OAAAO..OAAAO..',
              '..OAAAO..OAAAO..',
              '...OOO....OOO...',
            ]
          : [
              '................',
              '..OOOO....OOOO..',
              '.OAAAAOOOOAAAAO.',
              '.OAYYAO..OAYYAO.',
              '..OAAAO..OAAAO..',
              '..OOOOO..OOOOO..',
              '................',
            ],
    };
  }

  if (species === 'salmon') {
    if (stageIdx === 0) {
      return {
        palette: { O: '#7c2d12', R: '#fb923c', Y: '#fde047', E: '#0f172a' },
        grid: [
          '..OOO..OOO..',
          '.ORYROORYRO.',
          '.OEYO..OEYO.',
          '..OOO..OOO..',
        ],
      };
    }
    if (stageIdx === 1) {
      // Alevin fry
      return {
        palette: { O: '#0c4a6e', S: '#7dd3fc', Y: '#fb923c', E: '#0f172a', W: '#ffffff' },
        grid:
          f === 0
            ? [
                '.....OOOOOO....',
                'O..OOSSSSSEWO..',
                'OSOSSSSSSSWSO..',
                'O..OOYYSSSOO...',
                '.....OOOO......',
              ]
            : [
                '.....OOOOOO....',
                '.O.OOSSSSSEWO..',
                '.OSOSSSSSSWSO..',
                '.O.OOYYSSSOO...',
                '.....OOOO......',
              ],
      };
    }
    const isSpawn = stageIdx === 3;
    return {
      palette: isSpawn
        ? { O: '#450a0a', B: '#dc2626', H: '#fca5a5', G: '#16a34a', W: '#ffffff', E: '#0f172a' }
        : { O: '#0f172a', B: '#64748b', H: '#e2e8f0', G: '#38bdf8', W: '#ffffff', E: '#0f172a' },
      grid:
        f === 0
          ? [
              '.......OOOOO......',
              '....OOOBBBBBOO....',
              'O..OGGGHHHHHBBEO..',
              'OBOOGHHHHHHHHBWBO.',
              'OBBBBBBBBBBBBBBOO.',
              'O..OOHHHHHHHBOO...',
              '.....OOOOOOO......',
            ]
          : [
              '.......OOOOO......',
              '....OOOBBBBBOO....',
              '.O.OGGGHHHHHBBEO..',
              'OBOOGHHHHHHHHBWBO.',
              'OBBBBBBBBBBBBBBOO.',
              '.O.OOHHHHHHHBOO...',
              '.....OOOOOOO......',
            ],
    };
  }

  // polar_bear
  const cub = stageIdx === 0;
  return {
    palette: {
      O: '#334155',
      W: '#f8fafc',
      S: '#cbd5e1',
      N: '#0f172a',
      C: '#bae6fd',
    },
    grid: cub
      ? [
          '....OO...OO...',
          '...OWWO.OWWO..',
          '..OWWWWWWWNO..',
          '.OWWWWWWWWWO..',
          '.OSSWWWWWWSSO.',
          '..OWO....OWO..',
          '..OO......OO..',
        ]
      : f === 0
      ? [
          '........OO..OO..',
          '.......OWWOOOWO.',
          '..OOOO.OWWWWNWO.',
          '.OWWWWOWWWWWWWNO',
          'OWWWWWWWWWWWWWO.',
          'OSWWWWWWSSSSWWO.',
          '.OWWO....OWWWO..',
          '.OWWO....OWWWO..',
          '.OOO......OOO...',
        ]
      : [
          '........OO..OO..',
          '.......OWWOOOWO.',
          '..OOOO.OWWWWNWO.',
          '.OWWWWOWWWWWWWNO',
          'OWWWWWWWWWWWWWO.',
          'OSWWWWWWSSSSWWO.',
          '..OWWO..OWWWO...',
          '..OWWO..OWWWO...',
          '..OOO....OOO....',
        ],
  };
}

export function getRoleplayFoodSprite(species: string): PixelSpriteSpec {
  if (species === 'butterfly') {
    return {
      palette: { O: '#831843', P: '#f472b6', Y: '#fde047', G: '#22c55e' },
      grid: [
        '..PP..PP..',
        '.PPYYPPYY.',
        '..PPYYPP..',
        '...OGGO...',
        '...OGGO...',
      ],
    };
  }
  if (species === 'salmon' || species === 'polar_bear') {
    return {
      palette: { O: '#0369a1', B: '#38bdf8', H: '#e0f2fe', E: '#0f172a' },
      grid: [
        '..OOOOO...',
        'OOBHHHBEO.',
        '.OOBBBBO..',
      ],
    };
  }
  // mosquito / fly for frog
  return {
    palette: { O: '#0f172a', W: '#e2e8f0', G: '#4ade80' },
    grid: [
      '.WW..WW.',
      'OOGGGGOO',
      '..OOOO..',
    ],
  };
}

export function getRoleplayPredatorSprite(species: string, frame: number): PixelSpriteSpec {
  const f = frame % 2;
  if (species === 'butterfly') {
    // Predatory bird
    return {
      palette: { O: '#450a0a', R: '#dc2626', A: '#f59e0b', W: '#ffffff', E: '#0f172a' },
      grid:
        f === 0
          ? [
              '...OOO......',
              '..ORROOOOO..',
              '.ORRRRRRREAO',
              'OORRRRRRRRO.',
              '..OOOOOOOO..',
            ]
          : [
              '.OOOO.......',
              'ORRRROOOOO..',
              '..ORRRRRREAO',
              'OORRRRRRRRO.',
              '..OOOOOOOO..',
            ],
    };
  }
  // Aquatic / Arctic shark-orca predator
  return {
    palette: { O: '#4c0519', R: '#e11d48', D: '#881337', W: '#ffffff', E: '#0f172a' },
    grid:
      f === 0
        ? [
            '.....OOO......',
            '....ORRO......',
            'O..ORRRRRROO..',
            'ORORRRRRRREWO.',
            'ORRRDDDDWWWWO.',
            'O..OODDDDOOO..',
          ]
        : [
            '.....OOO......',
            '....ORRO......',
            '.O.ORRRRRROO..',
            'ORORRRRRRREWO.',
            'ORRRDDDDWWWWO.',
            '.O.OODDDDOOO..',
          ],
  };
}

export function getPlantRoleplaySprite(
  species: 'bean' | 'cactus' | 'mangrove',
  stageIdx: number,
  options: { water: number; pollinated: boolean }
): PixelSpriteSpec {
  const dry = options.water < 25;
  const leafMain = dry ? '#eab308' : '#22c55e';
  const leafLight = dry ? '#fef08a' : '#86efac';
  const leafDark = dry ? '#a16207' : '#15803d';

  if (species === 'cactus') {
    if (stageIdx === 0) {
      return {
        palette: { O: '#451a03', S: '#d97706', G: '#4ade80' },
        grid: [
          '...OO...',
          '..OGGO..',
          '..OSSO..',
          '...OO...',
        ],
      };
    }
    if (stageIdx === 1) {
      return {
        palette: { O: '#14532d', G: '#16a34a', L: '#4ade80', S: '#fef08a' },
        grid: [
          '...OOOO...',
          '..OGLLGO..',
          '.SOGLLGOS.',
          '..OGLLGO..',
          '..OOOOOO..',
        ],
      };
    }
    const hasFlower = stageIdx === 3;
    return {
      palette: {
        O: '#14532d',
        G: '#16a34a',
        L: '#4ade80',
        S: '#fef08a',
        F: options.pollinated ? '#f59e0b' : '#f472b6',
        Y: '#fde047',
      },
      grid: [
        hasFlower ? '....FFYFF...' : '............',
        '....OOOO....',
        '...OGLLGO...',
        '.OOOGLLGOOO.',
        'OGLOGLLGOLGO',
        'OGGOGLLGOGGO',
        '.OOOGLLGOOO.',
        '...SOGLLGOS.',
        '....OGLLGO..',
        '...SOGLLGOS.',
        '....OGLLGO..',
        '....OOOOOO..',
      ],
    };
  }

  if (species === 'mangrove') {
    if (stageIdx === 0) {
      return {
        palette: { O: '#14532d', G: '#22c55e', B: '#78350f' },
        grid: [
          '..OO..',
          '.OGGO.',
          '.OGGO.',
          '.OBBO.',
          '.OBBO.',
          '..OO..',
        ],
      };
    }
    const hasFlower = stageIdx === 3;
    return {
      palette: {
        O: '#052e16',
        G: leafMain,
        L: leafLight,
        D: leafDark,
        B: '#78350f',
        T: '#a16207',
        F: options.pollinated ? '#f59e0b' : '#fde047',
      },
      grid: [
        hasFlower ? '....OOOFFFOOO...' : '....OOOOOOOO....',
        '..OOGLLLLLLGOO..',
        '.OGGGLLLLLLGGGO.',
        '.ODGGGGGGGGGGDO.',
        '..OOODGGGGDOOO..',
        '.....OOBBOO.....',
        '....OBTBBTBO....',
        '...OBT.BB.TBO...',
        '..OBT..BB..TBO..',
        '.G.BT..BB..TB.G.',
        '.G.O...OO...O.G.',
      ],
    };
  }

  // bean
  if (stageIdx === 0) {
    return {
      palette: { O: '#451a03', B: '#d97706', L: '#fde68a', G: '#4ade80' },
      grid: [
        '....OO...',
        '...OGGO..',
        '..OBBBLO.',
        '..OBBBBO.',
        '...OOOO..',
      ],
    };
  }
  if (stageIdx === 1) {
    return {
      palette: { O: '#052e16', G: leafMain, L: leafLight },
      grid: [
        '.OOOO..OOOO.',
        'OGLLGOOGLLGO',
        '.OOOOOO.OOO.',
        '.....OGGO...',
        '.....OGGO...',
        '.....OGGO...',
      ],
    };
  }
  const hasFlower = stageIdx === 3;
  return {
    palette: {
      O: '#052e16',
      G: leafMain,
      L: leafLight,
      D: leafDark,
      F: options.pollinated ? '#f59e0b' : '#f472b6',
      Y: '#fde047',
    },
    grid: [
      hasFlower ? '....FFFF....' : '....OOOO....',
      hasFlower ? '...FFYYFF...' : '...OGLLGO...',
      '....FFFF....',
      '.OOOOGGOOOO.',
      'OGLLGOGGLLGO',
      'ODGGGOOGGGDO',
      '.OOOOOGGOOO.',
      '.....OGGO...',
      '..OO.OGGO.OO',
      '.OGLOOGGOOLG',
      '..OO.OGGO.OO',
      '.....OGGO...',
    ],
  };
}

// ============================================================================
// HARDY-WEINBERG & DNA EVOLUTION & TROPHIC PIXEL SPRITES
// ============================================================================

export function getMorphCreatureSprite(
  furColor: string,
  furDark: string,
  wingColor: string | null,
  isFluffyCold: boolean,
  isHeatCrest: boolean,
  frame = 0
): PixelSpriteSpec {
  const f = frame % 2;
  const palette: PixelPalette = {
    O: '#0f172a',
    F: furColor,
    D: furDark,
    H: '#ffffff',
    E: '#0f172a',
    W: wingColor || furColor,
    C: '#f59e0b',
  };
  if (wingColor) {
    return {
      palette,
      grid:
        f === 0
          ? [
              isHeatCrest ? '......CCCC......' : '......OOOO......',
              '.WWW..OFFFFO..WWW',
              'WWWWWOFFFFFFOWWWW',
              '.WWWOOFHEEFHOOWW.',
              '....OFFFFFFFFO...',
              '....ODDDDDDDDO...',
              '.....OFF..FFO....',
            ]
          : [
              isHeatCrest ? '......CCCC......' : '......OOOO......',
              '......OFFFFO.....',
              '..WWWOFFFFFFOWW..',
              '..WWOFHEEFHOWW...',
              '....OFFFFFFFFO...',
              '....ODDDDDDDDO...',
              '.....OFF..FFO....',
            ],
    };
  }
  if (isFluffyCold) {
    return {
      palette,
      grid:
        f === 0
          ? [
              '....OO..OO....',
              '...OFFOOFFO...',
              '..OFFFFFFFFO..',
              '.OFFHEEEHFFFO.',
              '.OFFFFFFFFFFO.',
              '.ODDDDDDDDDDO.',
              '..OFFF..FFFO..',
              '...OO....OO...',
            ]
          : [
              '....OO..OO....',
              '...OFFOOFFO...',
              '..OFFFFFFFFO..',
              '.OFFHEEEHFFFO.',
              '.OFFFFFFFFFFO.',
              '.ODDDDDDDDDDO.',
              '...OFFF.FFFO..',
              '....OO...OO...',
            ],
    };
  }
  return {
    palette,
    grid:
      f === 0
        ? [
            isHeatCrest ? '.....CCCC.....' : '.....OOOO.....',
            '....OFFFFO....',
            '...OFFHEEFHO..',
            '...OFFFFFFFO..',
            '...ODDDDDDDO..',
            '....OFF.FFO...',
            '....OO...OO...',
          ]
        : [
            isHeatCrest ? '.....CCCC.....' : '.....OOOO.....',
            '....OFFFFO....',
            '...OFFHEEFHO..',
            '...OFFFFFFFO..',
            '...ODDDDDDDO..',
            '...OFF...FFO..',
            '...OO.....OO..',
          ],
  };
}

export function getTrophicTierSprite(tierIndex: number, frame = 0): PixelSpriteSpec {
  const f = frame % 2;
  if (tierIndex === 0) {
    // Pixel Clover / Plant
    return getTerrariumPlantSpec('rainforest', 0);
  }
  if (tierIndex === 1) {
    // Pixel Grasshopper / Herbivore
    return {
      palette: { O: '#052e16', G: '#4ade80', D: '#15803d', Y: '#fde047', E: '#0f172a' },
      grid:
        f === 0
          ? [
              '........OO..',
              '..OOOO.OGEO.',
              '.OGGGGOOGGO.',
              'OGDGGGGGGGO.',
              '.O..OOGGO...',
              '.....O..O...',
            ]
          : [
              '........OO..',
              '...OOO.OGEO.',
              '..OGGGOOGGO.',
              '.OGDGGGGGGO.',
              '.O..OOGGO...',
              '....O...O...',
            ],
    };
  }
  if (tierIndex === 2) {
    // Pixel Frog / Snake / Secondary Consumer
    return {
      palette: { O: '#0c4a6e', B: '#38bdf8', L: '#bae6fd', G: '#0284c7', E: '#0f172a', R: '#fb7185' },
      grid: [
        '.....OOOO...',
        '....OBBBERO.',
        '.OOOBBBBBO..',
        'OBLLBOOOOO..',
        '.OOOO.......',
      ],
    };
  }
  // Apex Eagle / Hawk
  return {
    palette: { O: '#451a03', B: '#b45309', Y: '#fbbf24', W: '#ffffff', E: '#0f172a' },
    grid:
      f === 0
        ? [
            'OO........OO',
            'OBBO.OO.OBBO',
            '.OBBOWWOBBO.',
            '..OBBWEYBO..',
            '...OBBBBO...',
            '....OYYO....',
          ]
        : [
            '............',
            '..OO.OO.OO..',
            '.OBBOWWOBBO.',
            '..OBBWEYBO..',
            '...OBBBBO...',
            '....OYYO....',
          ],
  };
}
