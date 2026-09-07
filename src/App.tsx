import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedWork from "./components/FeaturedWork";
import Solutions from "./components/Solutions";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import ContactModal from "./components/ContactModal";
import EstimatorModal from "./components/EstimatorModal";
import DemoPreviewModal from "./components/DemoPreviewModal";
import { initSmoothScroll, initReveals, initAnalytics } from "./lib/motion";
import type { Project } from "./data/projects";

type ModalKind = null | "contact" | "estimator";

export default function App() {
  const [modal, setModal] = useState<ModalKind>(null);
  const [demoProject, setDemoProject] = useState<Project | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stopScroll = initSmoothScroll();
    const stopReveals = initReveals(mainRef.current);
    initAnalytics();
    return () => {
      stopReveals();
      stopScroll();
    };
  }, []);

  const openContact = () => setModal("contact");
  const openEstimator = () => setModal("estimator");
  const closeModal = () => setModal(null);

  const openDemo = (project: Project) => setDemoProject(project);
  const closeDemo = () => setDemoProject(null);

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main ref={mainRef}>
        <Hero onContact={openContact} />
        <FeaturedWork onPreview={openDemo} />
        <Solutions />
        <FinalCTA onStart={openEstimator} />
      </main>
      <Footer />
      <ContactModal open={modal === "contact"} onClose={closeModal} />
      <EstimatorModal open={modal === "estimator"} onClose={closeModal} />
      <DemoPreviewModal project={demoProject} onClose={closeDemo} />
    </MotionConfig>
  );
}
