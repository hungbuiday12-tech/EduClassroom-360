/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-6a0cc74a'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "index.html",
    "revision": "e493447a3bd1d2e7283af073d8f63ab8"
  }, {
    "url": "draco/draco_wasm_wrapper.js",
    "revision": "7a48a3fdc5785631621f4b20cd0937dc"
  }, {
    "url": "draco/draco_decoder.wasm",
    "revision": "279c1ac3a88b5620490d0b9835ab222f"
  }, {
    "url": "draco/draco_decoder.js",
    "revision": "5fcad04db3893d9fbb79418b1f8e44a1"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/virtual_pwa-register-BOcMhu1S.js",
    "revision": null
  }, {
    "url": "assets/vendor-react-CumqsUUt.js",
    "revision": null
  }, {
    "url": "assets/vendor-icons-BpQVJm5D.js",
    "revision": null
  }, {
    "url": "assets/three3DEnhancements-Dp5ImgX4.js",
    "revision": null
  }, {
    "url": "assets/soundEngine-BZhLy-Si.js",
    "revision": null
  }, {
    "url": "assets/rolldown-runtime-BWaJ3C7D.js",
    "revision": null
  }, {
    "url": "assets/roadmapData-CQJaOFQj.js",
    "revision": null
  }, {
    "url": "assets/productDocxExporter-DmB3Zocd.js",
    "revision": null
  }, {
    "url": "assets/lessonProgressStore-DzSxDQLj.js",
    "revision": null
  }, {
    "url": "assets/index-DhJUHS7i.js",
    "revision": null
  }, {
    "url": "assets/index-CgtryYwj.css",
    "revision": null
  }, {
    "url": "assets/handLandmarkerWorker-xPo-MoRQ.js",
    "revision": null
  }, {
    "url": "assets/handGestureTracker-SGG23gWd.js",
    "revision": null
  }, {
    "url": "assets/draco_wasm_wrapper-fZCQGLGb.js",
    "revision": null
  }, {
    "url": "assets/draco_wasm_wrapper-DxJM36Ib.js",
    "revision": null
  }, {
    "url": "assets/draco_decoder-fzg4nYZr.js",
    "revision": null
  }, {
    "url": "assets/draco_decoder-Z1_iN-Ht.wasm",
    "revision": null
  }, {
    "url": "assets/draco_decoder-C32yEggz.wasm",
    "revision": null
  }, {
    "url": "assets/customModelStore-BtR4gE0Z.js",
    "revision": null
  }, {
    "url": "assets/customModelBuilder-DiNgJj8G.js",
    "revision": null
  }, {
    "url": "assets/customLessonsStore-BZibD6WI.js",
    "revision": null
  }, {
    "url": "assets/csTracksData-Q_K52ws4.js",
    "revision": null
  }, {
    "url": "assets/confetti.module-Djt41fMX.js",
    "revision": null
  }, {
    "url": "assets/codeRunner-lv6asEeu.js",
    "revision": null
  }, {
    "url": "assets/XRayConfigPanel-DWQZOd_l.js",
    "revision": null
  }, {
    "url": "assets/VoiceMicButton-DTzcSmoO.js",
    "revision": null
  }, {
    "url": "assets/VisitorLandingPage-gxKqPNXh.js",
    "revision": null
  }, {
    "url": "assets/ViewportPortal-C6D_R9iR.js",
    "revision": null
  }, {
    "url": "assets/TypingParrotoSandbox-EB7dZXN0.js",
    "revision": null
  }, {
    "url": "assets/TechTeardown3DLab-DJrYc2oc.js",
    "revision": null
  }, {
    "url": "assets/SynapseVoiceOS-CLWKCLWf.js",
    "revision": null
  }, {
    "url": "assets/SynAIProChat-DdywTuE3.js",
    "revision": null
  }, {
    "url": "assets/SublimeEditor-T3k9fo3o.js",
    "revision": null
  }, {
    "url": "assets/StudyForum-Cm2XH2jg.js",
    "revision": null
  }, {
    "url": "assets/SolarSystem3DLab-DaGcQP6A.js",
    "revision": null
  }, {
    "url": "assets/SettingsModal-4aQL08UI.js",
    "revision": null
  }, {
    "url": "assets/ScrollReveal-DrGV897p.js",
    "revision": null
  }, {
    "url": "assets/PhysicsDomainsPage-o3-YRhWW.js",
    "revision": null
  }, {
    "url": "assets/PWAInstallModal-Bv90lSxR.js",
    "revision": null
  }, {
    "url": "assets/MotionReelMiniChat-DkLVOVfZ.js",
    "revision": null
  }, {
    "url": "assets/MathStudio-CXICfS2u.js",
    "revision": null
  }, {
    "url": "assets/LiveMeetClassroom-nSvfT2zE.js",
    "revision": null
  }, {
    "url": "assets/LectureDirectorySection-CywEsTNA.js",
    "revision": null
  }, {
    "url": "assets/LearnerPortfolioModal-BByeHK06.js",
    "revision": null
  }, {
    "url": "assets/InteractiveScratchpad-C70QCZNh.js",
    "revision": null
  }, {
    "url": "assets/HologramModeControls-CsqNtMyL.js",
    "revision": null
  }, {
    "url": "assets/GuideTourPage-BO1AeA6M.js",
    "revision": null
  }, {
    "url": "assets/GrowthWorkspace-DryWKrEf.js",
    "revision": null
  }, {
    "url": "assets/GraphicsTierTriggerButton-BMIY5QtW.js",
    "revision": null
  }, {
    "url": "assets/GraphicsTierModal-CglPIN0C.js",
    "revision": null
  }, {
    "url": "assets/CommunityShowcaseView-CiiFrNTM.js",
    "revision": null
  }, {
    "url": "assets/CodeSimulationsPage-B7kWb028.js",
    "revision": null
  }, {
    "url": "assets/ClassroomOverview-BzuxePhG.js",
    "revision": null
  }, {
    "url": "assets/CS3DVisualizer-CaPqAQNx.js",
    "revision": null
  }, {
    "url": "assets/AuthorsPage-KQzkgt33.js",
    "revision": null
  }, {
    "url": "assets/AuthModal-C5xXTW8z.js",
    "revision": null
  }, {
    "url": "assets/AssemblyStudio3DLab-D8QSbNzN.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "208c700da959fc88658f9fa9fd37f96a"
  }, {
    "url": "pwa-192x192.png",
    "revision": "5671a77c90e0cb5b8822dd398dab2094"
  }, {
    "url": "pwa-512x512.png",
    "revision": "026111e1425239f4fed8983408d7ce31"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "6898edf9f6f8468f792403c95ceefa03"
  }, {
    "url": "assets/aistudio/image_0883e005.png",
    "revision": "59dd1c3e624675dcf7be1844e20b223f"
  }, {
    "url": "manifest.webmanifest",
    "revision": "6f7ff96e86cf14a265709698eaf18695"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
    denylist: [/^\/api\//, /\/mediapipe\//, /\/downloads\//]
  }));
  workbox.registerRoute(/\/assets\/.*\.(js|css|woff2?|ttf|woff)$/i, new workbox.StaleWhileRevalidate({
    "cacheName": "synapse-lazy-assets",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 120,
      maxAgeSeconds: 1209600
    })]
  }), 'GET');
  workbox.registerRoute(/\/mediapipe\/.*/i, new workbox.CacheFirst({
    "cacheName": "synapse-mediapipe-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 12,
      maxAgeSeconds: 2592000
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "synapse-google-fonts",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 20,
      maxAgeSeconds: 31536000
    })]
  }), 'GET');
  workbox.registerRoute(/\/api\/.*/i, new workbox.NetworkOnly(), 'GET');

}));
