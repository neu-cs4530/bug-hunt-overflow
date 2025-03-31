import './index.css';
import { useMemo } from 'react';

/**
 * Options for styling a code line.
 */
export type CodeLineStyle = Partial<{
  backgroundColor: string;
  cursor: string;
}>;

/**
 * TODO: complete
 */
export type CodeLineProps = {
  children: string;
  style: CodeLineStyle;
  lineNumber?: number;
  onClick?: (lineNumber?: number) => void;
};

/**
 * Props for rendering the CodeBlock component. See component documentation
 * for individual prop explanations.
 * - code - the formatted code string to render
 * - onClickLine(lineNumber: number): void - called when a line in the code block is clicked, passes clicked line number as parameter.
 * - highlightLines - object where line number is the key and the value are highlight options for that line.
 */
export type CodeBlockProps = {
  code: string;
  onClickLine?: (lineNumber: number) => void;
  lineStyles?: { [key: number]: CodeLineStyle };
};

export const CodeLine = (props: CodeLineProps) => {
  const { children, style, lineNumber, onClick } = props;
  return (
    <pre
      className='code-line'
      onClick={() => {
        if (onClick) {
          onClick(lineNumber);
        }
      }}
      style={{
        ...style,
      }}>
      <span className='code-line-number'>{lineNumber}</span>
      <code>{children}</code>
    </pre>
  );
};

export const CodeBlock = (props: CodeBlockProps) => {
  const { code, onClickLine, lineStyles } = props;

  const codeLines = useMemo(() => (code ? code.split('\n') : []), [code]);

  return (
    <div className={`code-block ${onClickLine ? 'interactive' : ''}`}>
      <code>
        {codeLines.map((codeLine, i) => {
          const lineNumber = i + 1;
          const style = lineStyles && lineStyles[lineNumber];

          return (
            <CodeLine
              key={lineNumber}
              lineNumber={lineNumber}
              style={style || {}}
              onClick={() => {
                if (onClickLine) {
                  onClickLine(lineNumber);
                }
              }}>
              {codeLine}
            </CodeLine>
          );
        })}
      </code>
    </div>
  );
};
