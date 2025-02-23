import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default function CodeBlock({ language, code }) {
  const codeRef = useRef();
  useEffect(() => {
    if (codeRef && codeRef.current) {
      hljs.highlightBlock(codeRef.current);
    }
  }, [code]);

  return (
    <pre>
      <code className={`language-${language} rounded-lg`} ref={codeRef}>
        {code}
      </code>
    </pre>
  );
};