"use client";

export const CopyLink = ({ headingId }: { headingId: string }) => {
  return (
    <a
      href={`#${headingId}`}
      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
      title="Copy link to heading"
      onClick={(e) => {
        e.preventDefault();
        const url = `${window.location.origin}${window.location.pathname}#${headingId}`;
        navigator.clipboard.writeText(url);
      }}
    >
      #
    </a>
  );
};
