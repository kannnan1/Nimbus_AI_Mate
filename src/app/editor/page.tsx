
'use client';

import { Suspense } from 'react';
import { EditorPage } from "@/components/editor-page";
import { useSearchParams } from 'next/navigation';

function EditorContent() {
  const searchParams = useSearchParams();
  const documentTitle = searchParams.get('title');

  let initialContent = "";
  let initialTitle = "Untitled Document";

  if (documentTitle) {
    const storedDocsString = localStorage.getItem("myDocuments");
    const storedDocs = storedDocsString ? JSON.parse(storedDocsString) : [];
    const docToOpen = storedDocs.find((doc: { title: string }) => doc.title === documentTitle);
    if (docToOpen) {
      initialContent = docToOpen.content || "";
      initialTitle = docToOpen.title;
    }
  }
  
  return <EditorPage initialTitle={initialTitle} initialContent={initialContent} />;
}


export default function Editor() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorContent />
    </Suspense>
  );
}
