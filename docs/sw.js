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
    "revision": "0f915b96d5ccbde08b3ebf62f3062e90"
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
    "url": "assets/virtual_pwa-register-uJ-HLlXa.js",
    "revision": null
  }, {
    "url": "assets/vendor-react-CY3uflm1.js",
    "revision": null
  }, {
    "url": "assets/vendor-icons-BXYhyrKJ.js",
    "revision": null
  }, {
    "url": "assets/useSpeechRecognition-B9pu_Kt4.js",
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
    "url": "assets/roadmapData-DahBKPE9.js",
    "revision": null
  }, {
    "url": "assets/productDocxExporter-DLiH240D.js",
    "revision": null
  }, {
    "url": "assets/liveCoPilotBridge-lyxrq3ZP.js",
    "revision": null
  }, {
    "url": "assets/lessonProgressStore-BMxXaE4r.js",
    "revision": null
  }, {
    "url": "assets/index-yvNK1hKp.css",
    "revision": null
  }, {
    "url": "assets/index-C0EWNd9T.js",
    "revision": null
  }, {
    "url": "assets/handLandmarkerWorker-xPo-MoRQ.js",
    "revision": null
  }, {
    "url": "assets/handGestureTracker-D6_FVD_G.js",
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
    "url": "assets/customModelStore-BixwctKc.js",
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
    "url": "assets/codeRunner-ltjDMsC7.js",
    "revision": null
  }, {
    "url": "assets/XRayConfigPanel-vhPY7seh.js",
    "revision": null
  }, {
    "url": "assets/VoiceMicButton-74AZExwu.js",
    "revision": null
  }, {
    "url": "assets/VisitorLandingPage-DwXi1KDV.js",
    "revision": null
  }, {
    "url": "assets/ViewportPortal-CbzLL9G3.js",
    "revision": null
  }, {
    "url": "assets/TypingParrotoSandbox-EiKnFu9T.js",
    "revision": null
  }, {
    "url": "assets/TechTeardown3DLab-DuKocjGm.js",
    "revision": null
  }, {
    "url": "assets/SynapseVoiceOS-DYhophxj.js",
    "revision": null
  }, {
    "url": "assets/SynAIProChat-C0MttjaY.js",
    "revision": null
  }, {
    "url": "assets/SublimeEditor-BbBQx50n.js",
    "revision": null
  }, {
    "url": "assets/StudyForum-D9pPK-Fa.js",
    "revision": null
  }, {
    "url": "assets/SolarSystem3DLab-mN1Io3G7.js",
    "revision": null
  }, {
    "url": "assets/SettingsModal-DOmn7VIW.js",
    "revision": null
  }, {
    "url": "assets/PhysicsDomainsPage-Bsm4-ie5.js",
    "revision": null
  }, {
    "url": "assets/PWAInstallModal-COYdS256.js",
    "revision": null
  }, {
    "url": "assets/MathStudio-BRM5QdFk.js",
    "revision": null
  }, {
    "url": "assets/LiveMeetClassroom-5CoQ2w8f.js",
    "revision": null
  }, {
    "url": "assets/LectureDirectorySection-B6S7JQfM.js",
    "revision": null
  }, {
    "url": "assets/LearnerPortfolioModal-COlvG_W1.js",
    "revision": null
  }, {
    "url": "assets/InteractiveScratchpad-VQqUsW3K.js",
    "revision": null
  }, {
    "url": "assets/HologramModeControls-CcFEEMse.js",
    "revision": null
  }, {
    "url": "assets/GrowthWorkspace-C9-E7i6J.js",
    "revision": null
  }, {
    "url": "assets/GraphicsTierTriggerButton-D8a26nPz.js",
    "revision": null
  }, {
    "url": "assets/GraphicsTierModal-s-jrR8if.js",
    "revision": null
  }, {
    "url": "assets/CommunityShowcaseView-B7_OrxJg.js",
    "revision": null
  }, {
    "url": "assets/CodeSimulationsPage-BZQiz8O1.js",
    "revision": null
  }, {
    "url": "assets/ClassroomOverview-vdcpP6XR.js",
    "revision": null
  }, {
    "url": "assets/CS3DVisualizer-CawX8GHK.js",
    "revision": null
  }, {
    "url": "assets/AuthModal-p7uWhHI5.js",
    "revision": null
  }, {
    "url": "assets/AssemblyStudio3DLab-CBVT8PsC.js",
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
