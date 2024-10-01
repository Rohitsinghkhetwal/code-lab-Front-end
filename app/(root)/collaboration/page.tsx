import { Room } from "@/app/Room";
import { TextEditor } from "@/components/TextEditor";
import React from "react";


const Collaborations = () => {

  
  return (
    <div className="relative min-h-screen min-w-full">
      <Room>
        <TextEditor/>

      </Room>
    </div>
  );
};

export default Collaborations;
