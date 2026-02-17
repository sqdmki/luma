import Image from "next/image";
import Player from "./components/Player";

export default function Home() {
  return (
    <div className="relative flex-1 bg-(--bg-accent) rounded-[20px] p-[10px]">
      <Player />
    </div>
  );
}
