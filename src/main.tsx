import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import SpaceshipOs from "@/components/page.tsx";
import { Toaster } from "@/components/ui/sonner";
import { StateProvider } from "./state/state-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Fragment>
      <StateProvider>
        <SpaceshipOs />
        <Toaster position="bottom-right" expand richColors />
      </StateProvider>
    </Fragment>
  </StrictMode>,
);
