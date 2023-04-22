import Button from '@/components/Button';
import copy from 'copy-to-clipboard';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { RiFileCopyLine, RiLoader5Line, RiRefreshLine } from 'react-icons/ri';

export default function Names() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Get keywords from the URL
  const keywords = useMemo(() => {
    return decodeURI(
      (Array.isArray(router.query.keywords)
        ? router.query.keywords[0]
        : router.query.keywords) || ''
    );
  }, [router.query.keywords]);

  // Set keywords to the URL
  const setKeywords = (value: string) => {
    router.push({ query: { ...router.query, keywords: encodeURI(value) } });
  };

  // Input field values
  const [inputkeywords, setInputKeywords] = useState(keywords);

  const handleGenerate = () => {
    if (inputkeywords !== keywords) {
      setKeywords(inputkeywords);
    }
    setRetryCount((prev) => prev + 1);
  };

  // Error Toast
  useEffect(() => {
    if (router.isReady && (!keywords || keywords === '')) {
      toast.error('Keywords cannot be empty');
    }
  }, [keywords, router.isReady, retryCount]);

  useEffect(() => {
    setInputKeywords(keywords);
  }, [keywords]);

  useEffect(() => {
    if (!router.isReady || !keywords || keywords === '') {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    console.log('Call API');

    const generateNames = async () => {
      setGeneratedText('');
      setLoading(true);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords,
        }),
        signal,
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error(
          (await response.json()).message || 'Something went wrong!'
        );
      }

      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setGeneratedText((prev) =>
          (prev + chunkValue).replace(', ', ',').replace(/\.$/, '')
        );
      }
      setLoading(false);
    };

    generateNames().catch((e) => console.log(e));

    return () => {
      controller.abort();
      setLoading(false);
    };
  }, [keywords, router.isReady, retryCount, retryCount]);

  return (
    <main className="flex min-h-screen justify-center px-4 py-16">
      <div className="fixed left-0 right-0 top-0 z-50 flex min-h-[4rem] items-center justify-center bg-white px-4 shadow-lg">
        <Link
          href="/"
          className="mr-4 hidden text-2xl font-bold sm:mr-auto sm:block"
        >
          <span className="text-gray-950">Names</span>
          <span className="text-blue-600">GPT</span>
        </Link>

        <div className="relative w-full max-w-full sm:absolute sm:max-w-xs">
          <input
            value={inputkeywords}
            onChange={(e) => setInputKeywords(e.currentTarget.value)}
            className="w-full rounded-2xl border-2 border-solid border-gray-300 px-4 py-1.5 pr-10 text-base outline-2 outline-gray-400"
            type="text"
            placeholder="Type keywords"
          />
          <Button
            disabled={loading}
            size="sm"
            className="absolute right-0 top-0 mr-1 mt-1"
            rightIcon={
              loading ? (
                <RiLoader5Line size="1.25rem" className="animate-spin" />
              ) : (
                <RiRefreshLine size="1.25rem" />
              )
            }
            onClick={handleGenerate}
            square
            variant="filled"
          />
        </div>
      </div>

      <div className="mt-6 flex h-full w-full max-w-4xl flex-wrap items-stretch">
        {generatedText &&
          generatedText.split(',').map((rawName, idx) => {
            const name = rawName.toUpperCase();
            return (
              <div
                onClick={() => {
                  const copied = copy(name);
                  if (copied) {
                    toast.success('Copied!');
                  }
                }}
                key={idx}
                className="group flex h-24 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white px-6 py-4 text-xl font-semibold transition-all hover:z-10 hover:shadow-alt-lg sm:basis-1/2 md:basis-1/3"
              >
                <span className="overflow-hidden text-ellipsis">{name}</span>
                <div>
                  <div className="relative ml-0 h-5 w-0 overflow-hidden transition-all group-hover:ml-2 group-hover:w-5">
                    <RiFileCopyLine className="absolute right-0 top-0 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <Toaster position="bottom-center" />
    </main>
  );
}
