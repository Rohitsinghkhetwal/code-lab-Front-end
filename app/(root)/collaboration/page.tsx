import React from "react";
import { Room } from "@/app/Room";
import { TextEditor } from "@/components/TextEditor";

const Collaborations = () => {
  return (
    <div className="relative min-h-screen min-w-full  ">
      <Room>
        <TextEditor />
      </Room>
    </div>
  );
};

export default Collaborations;
