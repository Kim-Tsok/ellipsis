import Image from 'next/image';

const OUTER_TEXT =
  'half-formed idea · don’t lose this · call mom · that riff from the train · wait what if · grocery list · Tuesday 4pm · untitled thought · remember the graph · ';
const INNER_TEXT =
  'groceries 10am — pick kids up 3pm — workout milestone reached — Mood: high — ';

export function ThoughtOrbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <svg
        viewBox="0 0 520 520"
        className="h-full w-full"
        aria-hidden
        role="presentation"
      >
        <defs>
          <path
            id="orbit-outer"
            d="M260,260 m-232,0 a232,232 0 1,1 464,0 a232,232 0 1,1 -464,0"
          />
          <path
            id="orbit-inner"
            d="M260,260 m-168,0 a168,168 0 1,1 336,0 a168,168 0 1,1 -336,0"
          />
        </defs>
        <text
          className="font-instrument-serif"
          fill="#9aa3a6"
          fontSize="15"
          letterSpacing="1.2"
        >
          <textPath href="#orbit-outer">{OUTER_TEXT.repeat(2)}</textPath>
        </text>
        <text
          className="font-instrument-serif"
          fill="#4FA1AF"
          fontSize="16"
          letterSpacing="0.8"
        >
          <textPath href="#orbit-inner">{INNER_TEXT.repeat(2)}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/ellipsis%20logo.svg"
          alt=""
          width={148}
          height={148}
          className="h-[38%] w-[38%]"
        />
      </div>
    </div>
  );
}
