import React from "react";
import { Room } from "@/app/Room";
import { TextEditor } from "@/components/TextEditor";

const Collaborations = () => {
  return (
    <div className="bg-green-100">
      <Room>
        <TextEditor />
      </Room>
    </div>
  );
};

export default Collaborations;
