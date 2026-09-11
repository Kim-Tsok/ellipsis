const features = [
  {
    title: 'Capture fragments',
    body: 'Type the thought as it arrives. No folders, no tags, no deciding where it belongs.',
  },
  {
    title: 'See the connections',
    body: 'Gemini and embeddings cluster related fragments so you can literally watch ideas link up.',
  },
  {
    title: 'A graph, not a pile',
    body: 'Your notes become a visual map. Follow a thread instead of hunting through a list.',
  },
  {
    title: 'Finish what matters',
    body: 'At the end of the day, Ellipsis nudges you back to the fragments that are worth fleshing out.',
  },
];

export function Features() {
  return (
    <section className="bg-white px-6 py-20 md:px-12 lg:px-16 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="grid grid-cols-2 border border-[#1a1a1a]">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="border-[#1a1a1a] px-7 py-10 odd:border-r even:border-l-0 [&:nth-child(-n+2)]:border-b"
            >
              <h3 className="font-instrument-serif text-2xl text-[#1a1a1a]">
                {feature.title}
              </h3>
              <p className="font-instrument-serif mt-4 max-w-[16rem] text-[15px] leading-relaxed text-[#4a4a4a]">
                {feature.body}
              </p>
            </article>
          ))}
        </div>

        <div className="lg:pl-8">
          <h2 className="font-instrument-serif text-5xl text-[#1a1a1a] lg:text-6xl">
            Features
          </h2>
          <p className="font-instrument-serif mt-6 max-w-md text-base leading-relaxed text-[#4a4a4a]">
            A second brain that does the tidying for you. Drop thoughts in as
            they come — Ellipsis organizes the graph behind the scenes so you
            never have to structure first.
          </p>
        </div>
      </div>
    </section>
  );
}
