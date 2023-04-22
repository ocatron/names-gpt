import Button from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RiArrowRightLine } from 'react-icons/ri';
export default function Home() {
  const router = useRouter();

  // Input field values
  const [inputkeywords, setInputKeywords] = useState('');

  const handleGenerateNames = () => {
    if (inputkeywords !== '') {
      router.push({
        pathname: '/names',
        query: { keywords: encodeURI(inputkeywords) },
      });
    }
  };

  return (
    <main className="flex h-screen items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-md flex-col items-center">
        <span className="mb-6 block text-4xl font-bold sm:text-5xl">
          <span className="text-gray-950">Names</span>
          <span className="text-blue-600">GPT</span>
        </span>

        <div className="w-full">
          <div className="relative">
            <input
              value={inputkeywords}
              onChange={(e) => setInputKeywords(e.currentTarget.value)}
              className="w-full rounded-2xl border-2 border-solid border-gray-300 px-4 py-1.5 pr-10 text-base outline-2 outline-gray-400"
              type="text"
              placeholder="Type keywords"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleGenerateNames();
                }
              }}
            />
            <Button
              onClick={handleGenerateNames}
              size="sm"
              className="absolute right-0 top-0 mr-1 mt-1"
              rightIcon={<RiArrowRightLine size="1.25rem" />}
              square
              variant="filled"
            ></Button>
          </div>
        </div>
        <span className="mt-6 block text-center font-medium text-gray-400">
          <p>Type in some keywords separated by commas.</p>
          <p>Easy peasy!</p>
        </span>
      </div>
      <Link
        href="/test"
        className="absolute bottom-6 text-sm font-semibold text-gray-500"
      >
        @TraceThamara
      </Link>
    </main>
  );
}
