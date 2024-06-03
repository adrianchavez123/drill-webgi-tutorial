import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  MeshBasicMaterial2,
  Color,
  AssetImporter,
  mobileAndTabletCheck,
} from "webgi";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);
//WEBGI UPDATE
let needsUdate = true;

async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas") as HTMLCanvasElement,
    useRgbm: false,
  });

  const isMobile = mobileAndTabletCheck();
  console.log(isMobile);
  const manager = await viewer.addPlugin(AssetManagerPlugin);
  const camera = viewer.scene.activeCamera;
  const position = camera.position;
  const target = camera.target;
  const exitButton = document.querySelector(".button--exit") as HTMLElement;
  const customizerInterface = document.querySelector(
    ".customizer--container"
  ) as HTMLElement;
  // Add plugins individually.
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm));

  await viewer.addPlugin(SSRPlugin);
  await viewer.addPlugin(SSAOPlugin);

  await viewer.addPlugin(BloomPlugin);

  //leader
  const importer = manager.importer as AssetImporter;
  importer.addEventListener("onProgress", (ev) => {
    const progressRatio = ev.loaded / ev.total;
    console.log(progressRatio);
    document
      .querySelector(".progress")
      ?.setAttribute("style", `transform : scaleX(${progressRatio})`);
  });

  importer.addEventListener("onLoad", (ev) => {
    console.log("loaded");
    gsap.to(".loader", {
      x: "100%",
      duration: 0.8,
      ease: "power4.inOut",
      delay: 1,
      onComplete: () => {
        document.body.style.overflowY = "auto";
      },
    });
  });

  viewer.renderer.refreshPipeline();
  await manager.addFromPath("./assets/drill.glb");
  const drillMaterial = manager.materials?.findMaterialsByName(
    "Drill_01"
  )[0] as MeshBasicMaterial2;
  console.log(drillMaterial);

  if (isMobile) {
    position.set(-3.5, -1.1, 5.5);
    target.set(-0.8, 1.55, -0.7);
    camera.setCameraOptions({ fov: 40 });
  }
  window.scrollTo(0, 0);
  function setupScrollAnimation() {
    const tl = gsap.timeline();

    // First section
    tl.to(position, {
      x: isMobile ? -6.0 : 1.56,
      y: isMobile ? 5.5 : -2.26,
      z: isMobile ? -3.3 : -3.85,
      duration: 4,
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "top top",
        // markers: true,
        scrub: true,
        // scrub: 1,
        immediateRender: false,
      },
      onUpdate,
    })
      .to(".section--one--container", {
        xPercent: "-150",
        opacity: 0,
        duration: 4,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top 80%",
          scrub: 1,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(target, {
        x: isMobile ? -1.1 : -1.37,
        y: isMobile ? 1.0 : 1.99,
        z: isMobile ? -0.1 : -0.37,
        duration: 4,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          // markers: true,
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      })

      .to(position, {
        x: -3.4,
        y: 0.6,
        z: 1.71,
        duration: 4,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          // markers: true,
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(target, {
        x: -1.5,
        y: 2.13,
        z: -0.4,
        duration: 4,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          // markers: true,
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      });
  }

  setupScrollAnimation();

  function onUpdate() {
    needsUdate = true;
    viewer.renderer.resetShadows();
  }
  viewer.addEventListener("preFrame", () => {
    if (needsUdate) {
      camera.positionUpdated(true);
      camera.targetUpdated(true);
      needsUdate = false;
    }
  });

  //to second
  document.querySelector(".button--hero")?.addEventListener("click", () => {
    const element = document.querySelector(".second");
    window.scrollTo({
      top: element?.getBoundingClientRect().top,
      left: 0,
      behavior: "smooth",
    });
  });
  //scroll to top
  document.querySelector(".button--footer")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });

  //customize
  const sections = document.querySelector(".container") as HTMLElement;
  const mainContainer = document.querySelector(
    "#webgi-canvas-container"
  ) as HTMLElement;
  document
    .querySelector(".button--customize")
    ?.addEventListener("click", () => {
      sections.style.visibility = "hidden";
      mainContainer.style.pointerEvents = "all";
      document.body.style.cursor = "grab";

      gsap.to(position, {
        x: -2.6,
        y: 0.2,
        z: -9.6,
        duration: 1,
        ease: "power3.inOut",
        onUpdate,
      });
      gsap.to(target, {
        x: -1.5,
        y: 2.13,
        z: -0.4,
        duration: 1,
        ease: "power3.inOut",
        onUpdate,
      });
    });

  function enableControllers() {
    exitButton.style.visibility = "visible";
    customizerInterface.style.visibility = "visible";
    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: true });
  }

  document.querySelector(".button--exit")?.addEventListener("click", () => {
    gsap.to(position, {
      x: -3.4,
      y: 9.6,
      z: 1.71,
      duration: 1,
      ease: "power3.inOut",
      onUpdate,
    });
    gsap.to(target, {
      x: -1.5,
      y: 2.13,
      z: -0.4,
      duration: 1,
      ease: "power3.inOut",
      onUpdate,
      onComplete: enableControllers,
    });

    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });
    sections.style.visibility = "visible";
    mainContainer.style.pointerEvents = "none";
    document.body.style.cursor = "default";
    exitButton.style.visibility = "hidden";
    customizerInterface.style.visibility = "hidden";
  });

  document
    .querySelector(".button--colors.black")
    ?.addEventListener("click", () => {
      changeColor(new Color(0x383830).convertSRGBToLinear());
    });

  document
    .querySelector(".button--colors.red")
    ?.addEventListener("click", () => {
      changeColor(new Color(0x1e2d2d).convertSRGBToLinear());
    });

  document
    .querySelector(".button--colors.yellow")
    ?.addEventListener("click", () => {
      changeColor(new Color(0xffffff).convertSRGBToLinear());
    });
  function changeColor(colorToBeChanged: Color) {
    drillMaterial.color = colorToBeChanged;
    viewer.scene.setDirty();
  }
}

setupViewer();
