"use client";


import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import Collaboration from "@tiptap/extension-collaboration";

import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import * as Y from "yjs";

import { LiveblocksYjsProvider } from "@liveblocks/yjs";

import { useRoom, useSelf } from "@liveblocks/react/suspense";

import { useEffect, useState } from "react";

import { Toolbar } from "./Toolbar"

import styles from "./CollaborativeEditor.module.css";

import { Avatars } from "@/components/Avatars";

import jsPDF from "jspdf"

import Image from "next/image";
import toast from "react-hot-toast";
import useStore from "@/Store/Store";
import { LeaveRoom } from "@/app/(root)/api/room";
import { useRouter } from "next/navigation";


export function CollaborativeEditor() {

  const room = useRoom();

  const [doc, setDoc] = useState<Y.Doc>();

  const [provider, setProvider] = useState<any>();


  useEffect(() => {

    const yDoc = new Y.Doc();

    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    setDoc(yDoc);

    setProvider(yProvider);


    return () => {

      yDoc?.destroy();

      yProvider?.destroy();

    };

  }, [room]);


  if (!doc || !provider) {

    return null;

  }


  return <TiptapEditor doc={doc} provider={provider} />;

}


type EditorProps = {

  doc: Y.Doc;

  provider: any;

};


function TiptapEditor({ doc, provider }: EditorProps) {

  const clearLink = useStore((state) => state.ClearRoomLink);

  const userInfo = useSelf((me) => me.info);
  const router = useRouter();
  
  const {  roomLink , users} = useStore();
  
  
  const storedUserID = (users[0] as any)?.user?._id;
  


  const editor = useEditor({


    editorProps: {

      attributes: {

        // Add styles to editor element

        class: styles.editor,

      },

    },

    extensions: [

      StarterKit.configure({

        // The Collaboration extension comes with its own history handling

        history: false,

      }),

      // Register the document with Tiptap

      Collaboration.configure({

        document: doc,

      }),

      // Attach provider and user info

      CollaborationCursor.configure({

        provider: provider,

        user: userInfo,

      }),

    ],

  });


  function ExtractFiles(nodes: any) {
    let textContent = "";
    console.log("this is a nodes", nodes);
    nodes.forEach((temp: any) => {
      if (temp.type === "paragraph") {
        temp?.content?.forEach((item: any) => {
          if (item.type === "text") {
            textContent += item.text + " ";
          }
        });
      } else if (temp.type === "orderedList") {
        temp?.content?.forEach((OrderedItem: any) => {
          if (OrderedItem.type === "listItem") {
            OrderedItem.content.forEach((items: any) => {
              if (items.type === "paragraph") {
                items?.content.forEach((textItem: any) => {
                  if (textItem?.type === "text") {
                    textContent += textItem.text + " ";
                  }
                });
              }
            });
          }
        });
      }
      textContent += "\n";
      if (!temp.content) {
        textContent += "\n";
      }
    });
    return textContent;
  }


  const handleDownloadPdf = () => {
    if (editor) {
      const data = editor.getJSON();
      const res = data.content;
      const extractedText = ExtractFiles(res);
      const pdf = new jsPDF();
      pdf.text(extractedText, 10, 10);
      pdf.save("text-file.pdf");
    }
  };

  const copyRoomId = () => { 
    if(roomLink) {
      navigator.clipboard.writeText(roomLink)
    .then(() =>{
      toast.success("Link copied")
    })
    .catch((err) => {
      console.error("Failed to copy link "), err
    })
    }
  
  }

  const leaveRoom = async(roomID: string, userID: string) => {
    const { localStream, clearLocalStream, removeUser, users } = useStore.getState();
    const name = users[0]?.user?.username;
    try {

      if(localStream instanceof MediaStream) {
        localStream.getTracks().forEach((track) => track.stop());
        clearLocalStream();
      }
      await LeaveRoom(roomID, userID);
      toast.success("You left the room");
      clearLink();
      removeUser(name);
      
      router.push("/");
    }catch(err) {
      toast.error("Something wrong while leaving the room")
      throw err;

    }
    console.log("Leaving the room ....");
  }


  return (

    <div className={styles.container}>

      <div className={styles.editorHeader}>
   



        <Toolbar editor={editor} />

        <Avatars />
        <button
        onClick={handleDownloadPdf}
        className="bg-slate-600 text-white text-bold mx-2 px-3 py-1 rounded mb-2"
      >
        Download as Pdf
      </button>

      <button className="bg-red-400 px-3 py-2 rounded text-white font-semibold" onClick={() => leaveRoom(roomLink,storedUserID)}>
        Leave
      </button>

      <Image
       src="/icons/link.svg"
       alt="link"
       width={20}
       height={20}
       className="cursor-pointer"
       onClick={copyRoomId}
      />


      </div>
      <div className={styles.editorContainer}>
      <EditorContent editor={editor}/>
      </div>

    

    </div>

  );

}