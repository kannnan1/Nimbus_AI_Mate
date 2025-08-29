
'use client';

import { Suspense, useState, useEffect } from 'react';
import { EditorPage } from "@/components/editor-page";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const documentTitle = searchParams.get('title');

  const [initialContent, setInitialContent] = useState("");
  const [initialTitle, setInitialTitle] = useState("Untitled Document");
  const [initialSections, setInitialSections] = useState([]);
  const [initialComments, setInitialComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get data from history state first (for new docs)
    const navState = window.history.state;
    if (navState && navState.title === documentTitle && navState.content) {
        setInitialContent(navState.content);
        setInitialTitle(navState.title);
        setInitialSections(navState.sections || []);
        setInitialComments(navState.comments || []);
        
        // Clear the state to prevent it being used on refresh
        const url = `${pathname}?${searchParams.toString()}`;
        router.replace(url, { scroll: false });

    } else if (documentTitle) {
      // Fallback to localStorage for existing docs
      const storedDocsString = localStorage.getItem("myDocuments");
      const storedDocs = storedDocsString ? JSON.parse(storedDocsString) : [];
      const docToOpen = storedDocs.find((doc: { title: string }) => doc.title === documentTitle);
      if (docToOpen) {
        setInitialContent(docToOpen.content || "");
        setInitialTitle(docToOpen.title);
        setInitialSections(docToOpen.sections || []);
        setInitialComments(docToOpen.comments || []);
      }
    }
    setLoading(false);
  }, [documentTitle, pathname, router, searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <EditorPage initialTitle={initialTitle} initialContent={initialContent} initialSections={initialSections} initialComments={initialComments} />;
}


export default function Editor() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorContent />
    </Suspense>
  );
}
