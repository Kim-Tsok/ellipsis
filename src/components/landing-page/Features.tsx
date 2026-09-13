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
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        
        {/* Heading - shown first on mobile, right on desktop */}
        <div className="order-1 lg:order-2 lg:pl-8">
          <h2 className="font-instrument-serif text-5xl text-[#1a1a1a] lg:text-6xl">
            Features
          </h2>
          <p className="font-instrument-serif mt-6 max-w-md text-[17px] leading-relaxed text-[#4a4a4a]">
            A second brain that does the tidying for you. Drop thoughts in as
            they come — Ellipsis organizes the graph behind the scenes so you
            never have to structure first.
          </p>
        </div>

        {/* Grid - shown second on mobile, left on desktop */}
        <div className="order-2 grid grid-cols-1 border border-[#1a1a1a] md:grid-cols-2 lg:order-1">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              className={`border-[#1a1a1a] p-8 sm:p-10 ${
                i !== features.length - 1 ? 'border-b' : ''
              } md:border-b-0 md:[&:nth-child(-n+2)]:border-b md:odd:border-r`}
            >
              <h3 className="font-instrument-serif text-3xl text-[#1a1a1a]">
                {feature.title}
              </h3>
              <p className="font-instrument-serif mt-4 max-w-[16rem] text-base leading-relaxed text-[#4a4a4a]">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
