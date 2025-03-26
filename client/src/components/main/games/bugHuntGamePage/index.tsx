import { BugHuntGameState, GameInstance } from '@fake-stack-overflow/shared';
import useBugHuntGamePage from '../../../../hooks/useBugHuntGamePage';
import useUserContext from '../../../../hooks/useUserContext';
import { CodeBlock } from '../../codeBlock';

interface BugHuntGamePageProps {
  gameInstance: GameInstance<BugHuntGameState>;
}

const BugHuntGamePage = (props: BugHuntGamePageProps) => {
  const { gameInstance } = props;
  const { user } = useUserContext();
  const { selectedLines, lineStyles, handleSelectLine, handleSubmit } =
    useBugHuntGamePage(gameInstance);

  return (
    <>
      <div style={{ padding: '1rem' }}>
        <b>Selected Lines: </b> {selectedLines.join(', ')}
      </div>
      <CodeBlock
        code={
          'import Image from "next/image";\nimport styles from "./page.module.css";\n\nexport default function Home() {\n  return (\n    <div className={styles.page}>\n      <main className={styles.main}>\n        <Image\n          className={styles.logo}\n          src="/next.svg"\n          alt="Next.js logo"\n          width={180}\n          height={38}\n          priority\n        />\n        <ol>\n          <li>\n            Get started by editing <code>src/app/page.tsx</code>.\n          </li>\n          <li>Save and see your changes instantly.</li>\n        </ol>\n\n        <div className={styles.ctas}>\n          <a\n            className={styles.primary}\n            src="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"\n            target="_blank"\n            rel="noopener noreferrer"\n          >\n            <Image\n              className={styles.logo}\n              src="/vercel.svg"\n              alt="Vercel logomark"\n              width={20}\n              height={20}\n            />\n            Deploy now\n          </a>\n          <a\n            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"\n            target="_blank"\n            rel="noopener noreferrer"\n            className={styles.secondary}\n          >\n            Read our docs\n          </a>\n        </div>\n      </main>\n      <footer className={styles.footer}>\n        <a\n          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"\n          target="_blank"\n          rel="noopener noreferrer"\n        >\n          <Image\n            aria-hidden\n            src="/file.svg"\n            alt="File icon"\n            width={16}\n            height={16}\n          />\n          Learn\n        </a>\n        <a\n          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"\n          target="_blank"\n          rel="noopener noreferrer"\n        >\n          <Image\n            aria-hidden\n            src="/window.svg"\n            alt="Window icon"\n            width={16}\n            height={16}\n          />\n          Examples\n        </a>\n        <a\n          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"\n          target="_blank"\n          rel="noopener noreferrer"\n        >\n          <Image\n            aria-hidden\n            src="/globe.svg"\n            alt="Globe icon"\n            width={16}\n            height={16}\n          />\n          Go to nextjs.org →\n        </a>\n      </footer>\n    </div>\n  );\n}\n'
        }
        lineStyles={lineStyles}
        onClickLine={handleSelectLine}
      />
    </>
  );
};

export default BugHuntGamePage;
