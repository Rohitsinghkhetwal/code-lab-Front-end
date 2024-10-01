"use client";

import { ClientSideSuspense } from "@liveblocks/react";

import { LiveblocksYjsProvider } from "@liveblocks/yjs";

import Collaboration from "@tiptap/extension-collaboration";

import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import Highlight from "@tiptap/extension-highlight";

import { Image } from "@tiptap/extension-image";

import Placeholder from "@tiptap/extension-placeholder";

import Link from "@tiptap/extension-link";

import TaskList from "@tiptap/extension-task-list";

import { TextAlign } from "@tiptap/extension-text-align";

import { Typography } from "@tiptap/extension-typography";

import Youtube from "@tiptap/extension-youtube";

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import { EditorView } from "prosemirror-view";

import { useEffect, useState } from "react";

import * as Y from "yjs";

import { useRoom, useSelf } from "@liveblocks/react/suspense";

import { DocumentSpinner } from "@/primitives/Spinner";

import { CustomTaskItem } from "./CustomTaskItem";

import { SelectionMenu } from "./SelectionMenu";

import { Toolbar } from "./Toolbar";

import styles from "./TextEditor.module.css";

import { Avatars } from "@/components/Avatars";

import {jsPDF} from "jspdf"


export function TextEditor() {
  return (
    <ClientSideSuspense fallback={<DocumentSpinner />}>
      <Editor />
    </ClientSideSuspense>
  );
}

// Collaborative text editor with simple rich text and live cursors

export function Editor() {
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

  const { name, color, picture } = useSelf((me) => me.info);
  console.log("name", name);
  console.log("color", color);
  console.log("picture", picture);

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
        blockquote: {
          HTMLAttributes: {
            class: "tiptap-blockquote",
          },
        },

        code: {
          HTMLAttributes: {
            class: "tiptap-code",
          },
        },

        codeBlock: {
          languageClassPrefix: "language-",

          HTMLAttributes: {
            class: "tiptap-code-block",

            spellcheck: false,
          },
        },

        heading: {
          levels: [1, 2, 3],

          HTMLAttributes: {
            class: "tiptap-heading",
          },
        },

        // The Collaboration extension comes with its own history handling

        history: false,

        horizontalRule: {
          HTMLAttributes: {
            class: "tiptap-hr",
          },
        },

        listItem: {
          HTMLAttributes: {
            class: "tiptap-list-item",
          },
        },

        orderedList: {
          HTMLAttributes: {
            class: "tiptap-ordered-list",
          },
        },

        paragraph: {
          HTMLAttributes: {
            class: "tiptap-paragraph",
          },
        },
      }),

      Highlight.configure({
        HTMLAttributes: {
          class: "tiptap-highlight",
        },
      }),

      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),

      Link.configure({
        HTMLAttributes: {
          class: "tiptap-link",
        },
      }),

      Placeholder.configure({
        placeholder: "Start writing…",

        emptyEditorClass: "tiptap-empty",
      }),

      CustomTaskItem,

      TaskList.configure({
        HTMLAttributes: {
          class: "tiptap-task-list",
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Typography,

      Youtube.configure({
        modestBranding: true,

        HTMLAttributes: {
          class: "tiptap-youtube",
        },
      }),

      // Register the document with Tiptap

      Collaboration.configure({
        document: doc,
      }),

      // Attach provider and user info

      CollaborationCursor.configure({
        provider: provider,

        user: {
          name,

          color,

          picture,
        },
      }),
    ],
  });

  

  // we are creating the new instance of yjs docs  so the written content will come here in the form of json

  // this is the function that takes out written text in an editor 

  function ExtractFiles(nodes: any){
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
  })

    return textContent;
  };


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

  // Object structure of data in aur app
  // const data = [
  //   {
  //     type: "paragraph",
  //     content: [{ type: "text", text: "Hi I am Rohit Singh Khetwal" }]
  //   },
  //   {
  //     type: "orderedList",
  //     content: [
  //       { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "learn about nodejs authentication" }] }] },
  //       { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "study about 3 pointer in data structure " }] }] },
  //       { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "maximun sub tree" }] }] },
  //       { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "I know nothing " }] }] },
  //       // More items...
  //     ]
  //   }
  // ];

  return (
    <div className={styles.container}>
      <div className={styles.editorHeader}>
        {editor && <Toolbar editor={editor} />}

        <Avatars />
      </div>

      <div className={styles.editorPanel}>
        {editor && <SelectionMenu editor={editor} />}
        <EditorContent editor={editor} className={styles.editorContainer} />
      </div>

      <button onClick={handleDownloadPdf} className="bg-violet-400 px-3 py-1 rounded mb-2">
        Download as Pdf

      </button>
      
    </div>
  );
}

// Prevents a matchesNode error on hot reloading

EditorView.prototype.updateState = function updateState(state) {
  // @ts-ignore

  if (!this.docView) return;

  // @ts-ignore

  this.updateStateInner(state, this.state.plugins != state.plugins);
};
