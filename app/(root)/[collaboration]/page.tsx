import { Room } from "@/app/Room";
import { CollaborativeEditor } from "@/components/CollaborativeEditor";

import React from "react";


const Collaborations = () => {

  
  return (
    <div className="relative min-h-screen min-w-full">
      <Room>

        <CollaborativeEditor/>

      </Room>
    </div>
  );
};

export default Collaborations;
