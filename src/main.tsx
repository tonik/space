import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import SpaceshipOs from "@/components/page.tsx";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Fragment>
      <SpaceshipOs />
      <Toaster position="bottom-right" expand richColors />
    </Fragment>
  </StrictMode>,
);
