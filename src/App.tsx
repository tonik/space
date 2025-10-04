import { Toaster } from "./components/ui/sonner";
import SpaceshipOs from "./components/page";

export default function App() {
  return (
    <>
      <SpaceshipOs />
      <Toaster position="bottom-right" expand richColors />
    </>
  );
}
