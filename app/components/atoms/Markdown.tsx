import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <div className='text-slate-700 text-base leading-relaxed'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className='text-2xl font-bold text-slate-900 mt-4 mb-3' {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className='text-xl font-bold text-slate-900 mt-4 mb-2' {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className='text-lg font-semibold text-slate-900 mt-3 mb-2' {...props} />
          ),
          p: ({ node, ...props }) => <p className='my-2' {...props} />,
          a: ({ node, ...props }) => (
            <a className='text-main underline' target='_blank' rel='noreferrer' {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className='font-semibold text-slate-900' {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className='my-2 list-disc space-y-1 pl-6' {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className='my-2 list-decimal space-y-1 pl-6' {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className='my-3 border-l-4 border-main/40 pl-4 italic text-slate-600'
              {...props}
            />
          ),
          code: ({ node, ...props }) => (
            <code className='rounded bg-zinc-100 px-1.5 py-0.5 text-sm text-slate-800' {...props} />
          ),
          hr: () => <hr className='my-4 border-zinc-200' />,
          table: ({ node, ...props }) => (
            <div className='my-3 overflow-x-auto'>
              <table className='w-full border-collapse text-sm' {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className='border border-zinc-300 bg-zinc-100 px-3 py-2 text-left font-semibold text-slate-900' {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className='border border-zinc-300 px-3 py-2' {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
