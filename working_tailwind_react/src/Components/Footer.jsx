export default function Footer() {
  return (
    <footer className="bg-[#625750] text-white text-center py-10 text-sm relative z-10 border-t w-full">
      <p className="mb-4 font-semibold text-lg">FEATURED IN</p>
      <div className="flex justify-center gap-6 flex-wrap text-base">
        <span>BAR & BENCH</span>
        <span>LiveLaw</span>
        <span>Business Insider</span>
        <span>Economic Times</span>
        <span>LegalEra</span>
      </div>
    </footer>
  );
}
