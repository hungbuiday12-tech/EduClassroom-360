import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const errors = [];

  try {
    // 1. Desktop Host Context (1440x900)
    const hostCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const hostPage = await hostCtx.newPage();
    hostPage.on('pageerror', (err) => errors.push(`Host pageerror: ${err.message}`));
    hostPage.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('WebSocket') && !msg.text().includes('favicon')) {
        errors.push(`Host console.error: ${msg.text()}`);
      }
    });

    await hostPage.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Check Landing Page QR button
    const landingQrBtn = hostPage.getByTestId('landing-qr-remote-btn');
    await landingQrBtn.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✓ Landing page top bar QR Remote button visible');

    // Enter as Guest into main website
    await hostPage.getByRole('button', { name: /Vào trải nghiệm thử|Explore as Guest/i }).click();
    await hostPage.getByTestId('header-qr-remote-btn').waitFor({ state: 'visible', timeout: 10000 });
    console.log('✓ Main Header QR Remote button visible on Overview');

    // Check Header QR Remote button remains visible across pages & zero header clipping
    const checkHeaderNoClip = async (label) => {
      const stats = await hostPage.evaluate(() => {
        const hdr = document.querySelector('header');
        const btn = document.querySelector('[data-testid="header-qr-remote-btn"]');
        const rHdr = hdr ? hdr.getBoundingClientRect() : null;
        const rBtn = btn ? btn.getBoundingClientRect() : null;
        return {
          hdrRightOverflow: hdr ? hdr.scrollWidth - hdr.clientWidth : 0,
          btnVisible: Boolean(rBtn && rBtn.width > 0 && rBtn.height > 0),
          btnInsideHdr: Boolean(rHdr && rBtn && rBtn.right <= rHdr.right + 2 && rBtn.left >= rHdr.left - 2)
        };
      });
      if (!stats.btnVisible || !stats.btnInsideHdr || stats.hdrRightOverflow > 2) {
        throw new Error(`Header check failed on ${label}: ${JSON.stringify(stats)}`);
      }
      console.log(`✓ Header QR Remote verified cleanly on ${label}`);
    };

    await checkHeaderNoClip('Overview (Desktop)');

    // Open QR Modal and get pair URL
    await hostPage.getByTestId('header-qr-remote-btn').click();
    const pairLinkEl = hostPage.locator('a[href*="remoteRoom="]');
    await pairLinkEl.waitFor({ state: 'visible', timeout: 8000 });
    const pairUrl = await pairLinkEl.getAttribute('href');
    const qrImgSrc = await hostPage.locator('img[alt^="QR Room "]').getAttribute('src');
    if (!pairUrl || !qrImgSrc?.startsWith('data:image/')) {
      throw new Error(`Invalid QR modal data: pairUrl=${pairUrl}, hasQr=${Boolean(qrImgSrc)}`);
    }
    console.log(`✓ QR Modal opened with data-URL QR & pairUrl: ${pairUrl}`);

    // 2. Phone Controller Context (390x844)
    const phoneCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const phonePage = await phoneCtx.newPage();
    phonePage.on('pageerror', (err) => errors.push(`Phone pageerror: ${err.message}`));

    await phonePage.goto(pairUrl, { waitUntil: 'networkidle' });
    await phonePage.getByText(/Đã ghép màn hình|Screen paired/i).waitFor({ timeout: 10000 });
    console.log('✓ Phone Controller WebSocket paired with Host screen');

    // Verify Host modal updates connected phone counter to 1
    await hostPage.getByText(/1 điện thoại đang kết nối|1 phone active/i).waitFor({ timeout: 8000 });
    console.log('✓ Host QR modal shows 1 phone active');

    // Close host QR modal
    await hostPage.getByRole('button', { name: /Đóng|Close modal/i }).click();

    // Test Phone -> Host navigation ("Chuyển trang" -> "Toán 2D / Oxyz 3D")
    await phonePage.getByRole('button', { name: /Chuyển trang|Switch Page/i }).click();
    await phonePage.getByRole('button', { name: /Toán 2D \/ Oxyz 3D|Math 2D \/ Oxyz 3D/i }).click();
    await hostPage.waitForTimeout(800);
    await checkHeaderNoClip('Math 2D/3D Sims (Desktop)');

    // Test Phone -> Host 3D Orbit + Laser
    await phonePage.getByRole('button', { name: /Xoay 3D|3D Control/i }).click();
    const orbitPad = phonePage.getByText(/Bàn Di Xoay Mô Hình 3D|3D Orbit Touchpad/i).locator('..');
    const box = await orbitPad.boundingBox();
    if (box) {
      await phonePage.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.5);
      await phonePage.mouse.down();
      await phonePage.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.4, { steps: 5 });
      await phonePage.mouse.up();
    }
    await phonePage.getByRole('button', { name: /Slide & Laser|Slides & Laser/i }).click();
    await phonePage.getByRole('button', { name: /Slide \/ Bước Tiếp|Next Slide/i }).click();
    console.log('✓ Remote 3D orbit & slide commands relayed without errors');

    // 3. Verify Mobile Header (390x844) does not clip QR button
    const mobileHostCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobileHost = await mobileHostCtx.newPage();
    mobileHost.on('pageerror', (err) => errors.push(`Mobile Host pageerror: ${err.message}`));
    await mobileHost.goto(BASE_URL, { waitUntil: 'networkidle' });
    await mobileHost.getByRole('button', { name: /Vào thử|Vào trải nghiệm thử|Try Now/i }).click();
    await mobileHost.getByTestId('header-qr-remote-btn').waitFor({ state: 'visible', timeout: 8000 });
    const mobOverflow = await mobileHost.evaluate(() => {
      const hdr = document.querySelector('header');
      const btn = document.querySelector('[data-testid="header-qr-remote-btn"]');
      const rh = hdr?.getBoundingClientRect();
      const rb = btn?.getBoundingClientRect();
      return {
        docOverflow: document.documentElement.scrollWidth - window.innerWidth,
        hdrOverflow: hdr ? hdr.scrollWidth - hdr.clientWidth : 0,
        btnRightOk: Boolean(rh && rb && rb.right <= rh.right + 1)
      };
    });
    if (mobOverflow.docOverflow > 1 || mobOverflow.hdrOverflow > 2 || !mobOverflow.btnRightOk) {
      throw new Error(`Mobile 390px header overflow: ${JSON.stringify(mobOverflow)}`);
    }
    console.log('✓ Mobile 390x844 header QR button fits with zero clipping:', JSON.stringify(mobOverflow));
    await mobileHostCtx.close();

    // 4. Test Syn Reel -> Motion Video Tracker (Free-fall g + Pendulum T)
    await hostPage.getByRole('button', { name: /Trang chủ|Lớp học|Classroom|Overview/i }).first().click().catch(() => {});
    // Open Syn AI Dock -> click Syn Reel (04)
    const synAiBtn = hostPage.getByRole('button', { name: /Syn AI|Gia sư AI/i }).first();
    await synAiBtn.click();
    await hostPage.getByRole('button', { name: /Video 3B1B|Motion Reel/i }).click();
    await hostPage.getByTestId('synreel-tab-tracker').click();
    await hostPage.getByTestId('motion-video-tracker').waitFor({ state: 'visible', timeout: 8000 });

    // Free fall auto-track
    await hostPage.getByTestId('tracker-demo-freefall').click();
    await hostPage.getByTestId('tracker-auto-track-btn').click();
    await hostPage.waitForFunction(() => {
      const el = document.querySelector('[data-testid="tracker-measured-g"]');
      return el && el.textContent && el.textContent.includes('m/s');
    }, { timeout: 10000 });
    const gText = await hostPage.getByTestId('tracker-measured-g').textContent();
    const gVal = parseFloat(String(gText));
    if (Number.isNaN(gVal) || gVal < 9.3 || gVal > 10.3) {
      throw new Error(`Unexpected measured gravity g: ${gText}`);
    }
    console.log(`✓ Motion Video Tracker Free-Fall Auto Color Track -> g = ${gText}`);

    // Pendulum auto-track
    await hostPage.getByTestId('tracker-demo-pendulum').click();
    await hostPage.getByTestId('tracker-auto-track-btn').click();
    await hostPage.waitForFunction(() => {
      const el = document.querySelector('[data-testid="tracker-measured-t"]');
      return el && el.textContent && el.textContent.includes('s') && !el.textContent.includes('--');
    }, { timeout: 15000 });
    const tText = await hostPage.getByTestId('tracker-measured-t').textContent();
    const tVal = parseFloat(String(tText));
    if (Number.isNaN(tVal) || tVal < 1.4 || tVal > 1.8) {
      throw new Error(`Unexpected measured pendulum period T: ${tText}`);
    }
    console.log(`✓ Motion Video Tracker Pendulum Auto Color Track -> T = ${tText}`);

    if (errors.length > 0) {
      throw new Error(`Runtime errors recorded:\n${errors.join('\n')}`);
    }
    console.log('ALL E2E VERIFICATION CHECKS PASSED WITH ZERO ERRORS');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
