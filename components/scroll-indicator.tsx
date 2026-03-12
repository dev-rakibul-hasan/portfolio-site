"use client";

export function ScrollIndicator() {
  function scrollToAbout() {
    const section = document.getElementById("home-about");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <button
      type="button"
      onClick={scrollToAbout}
      className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--muted)]"
    >
      Scroll
      <span className="pulse-line inline-block h-4 w-px bg-[var(--brand)]" />
    </button>
  );
}
