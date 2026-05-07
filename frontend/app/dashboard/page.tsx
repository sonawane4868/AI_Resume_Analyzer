import { Suspense } from "react";
import DashBoardWrapper from "../components/DashBoardWrapper";

export default function Dash() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
      <DashBoardWrapper />
    </Suspense>
    </>
  );
}
