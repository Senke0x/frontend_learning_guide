'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    // 自定义标题渲染
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-5 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-4 mb-2">
        {children}
      </h3>
    ),
    // 自定义段落渲染
    p: ({ children }) => (
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        {children}
      </p>
    ),
    // 自定义列表渲染
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700 dark:text-slate-300 pl-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-700 dark:text-slate-300 pl-2">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-slate-700 dark:text-slate-300">
        {children}
      </li>
    ),
    // 自定义强调渲染
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900 dark:text-white">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-slate-800 dark:text-slate-200">
        {children}
      </em>
    ),
    // 自定义链接渲染
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        {children}
      </a>
    ),
    // 自定义行内代码渲染
    code: (props) => {
      const { className, children } = props;
      const match = /language-(\w+)/.exec(className || '');
      
      // 如果是代码块（有语言标识），使用语法高亮
      if (match) {
        const language = match[1];
        const code = String(children).replace(/\n$/, '');
        
        return (
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              borderRadius: '0.5rem',
            }}
          >
            {code}
          </SyntaxHighlighter>
        );
      }
      
      // 行内代码
      return (
        <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono text-slate-800 dark:text-slate-200">
          {children}
        </code>
      );
    },
    // 自定义代码块容器
    pre: ({ children }) => (
      <div className="my-4 rounded-lg overflow-hidden">
        {children}
      </div>
    ),
    // 自定义引用块渲染
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-slate-50 dark:bg-slate-800/50 rounded-r">
        {children}
      </blockquote>
    ),
    // 自定义表格渲染
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-slate-50 dark:bg-slate-800">
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
        {children}
      </td>
    ),
    // 自定义分隔线渲染
    hr: () => (
      <hr className="my-6 border-slate-200 dark:border-slate-700" />
    ),
  };

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
