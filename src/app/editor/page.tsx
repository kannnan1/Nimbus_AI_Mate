
'use client';

import { Suspense, useState, useEffect } from 'react';
import { EditorPage } from "@/components/editor-page";
import { useSearchParams } from 'next/navigation';

function EditorContent() {
  const searchParams = useSearchParams();
  const documentTitle = searchParams.get('title');

  const [initialContent, setInitialContent] = useState("");
  const [initialTitle, setInitialTitle] = useState("Untitled Document");
  const [initialSections, setInitialSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (documentTitle) {
      const storedDocsString = localStorage.getItem("myDocuments");
      const storedDocs = storedDocsString ? JSON.parse(storedDocsString) : [];
      const docToOpen = storedDocs.find((doc: { title: string }) => doc.title === documentTitle);
      if (docToOpen) {
        setInitialContent(docToOpen.content || "");
        setInitialTitle(docToOpen.title);
        setInitialSections(docToOpen.sections || []);
      }
    }
    setLoading(false);
  }, [documentTitle]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <EditorPage initialTitle={initialTitle} initialContent={initialContent} initialSections={initialSections} />;
}


export default function Editor() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorContent />
    </Suspense>
  );
}
