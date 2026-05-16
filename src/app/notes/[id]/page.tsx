'use client';

import React from 'react';
import Editor from '@/components/Editor';

export default function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  return <Editor params={unwrappedParams} />;
}
