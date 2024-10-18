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


// Collaborative text editor with simple rich text, live cursors, and live avatars

export function CollaborativeEditor() {

  const room = useRoom();

  const [doc, setDoc] = useState<Y.Doc>();

  const [provider, setProvider] = useState<any>();


  // Set up Liveblocks Yjs provider

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

  // Get user info from Liveblocks authentication endpoint

  const userInfo = useSelf((me) => me.info);


  // Set up editor with plugins, and place user info into Yjs awareness and cursors

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
      console.log("temp.content", JSON.stringify(temp.content, null, 2));
      if (!temp.content) {
        textContent += "\n";
      }
    });
    return textContent;
  }


  const handleDownloadPdf = () => {
    if (editor) {
      const data = editor.getJSON();
      let res = data.content;
      const extractedText = ExtractFiles(res);
      const pdf = new jsPDF();
      pdf.text(extractedText, 10, 10);
      pdf.save("text-file.pdf");
    }
  };


  return (

    <div className={styles.container}>

      <div className={styles.editorHeader}>
      <button
        onClick={handleDownloadPdf}
        className="bg-slate-600 text-white text-bold mx-2 px-3 py-1 rounded mb-2"
      >
        Download as Pdf
      </button>

        <Toolbar editor={editor} />

        <Avatars />

      </div>

      <EditorContent editor={editor} className={styles.editorContainer} />

    

    </div>

  );

}