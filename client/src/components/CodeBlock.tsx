'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'typescript', showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // 检测代码语言
  const detectLanguage = (code: string): string => {
    if (code.includes('interface ') || code.includes(': string') || code.includes(': number')) {
      return 'typescript';
    }
    if (code.includes('function ') || code.includes('const ') || code.includes('let ')) {
      return 'javascript';
    }
    if (code.includes('import ') && code.includes('from ')) {
      return 'typescript';
    }
    if (code.includes('<') && code.includes('/>')) {
      return 'tsx';
    }
    if (code.includes('npm ') || code.includes('pnpm ') || code.includes('npx ')) {
      return 'bash';
    }
    return language;
  };

  const detectedLanguage = detectLanguage(code);

  return (
    <div className="relative group my-4">
      {/* 语言标签 */}
      <div className="absolute top-0 left-0 px-3 py-1 text-xs font-mono text-slate-400 bg-slate-800 rounded-tl-lg rounded-br-lg z-10">
        {detectedLanguage}
      </div>
      
      {/* 复制按钮 */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="复制代码"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      <SyntaxHighlighter
        style={oneDark}
        language={detectedLanguage}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          padding: '2.5rem 1rem 1rem 1rem',
          fontSize: '0.875rem',
          borderRadius: '0.5rem',
          backgroundColor: '#1e293b',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
