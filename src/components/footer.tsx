'use client';

const SOCIAL_LINKS = {
  twitter: 'https://x.com/pretgemarket',
  discord: '#',
  telegram: '#',
  gitbook: 'https://pretgemarket.gitbook.io/pre-tge-market/',
};

export default function Footer() {
  const handleSocialClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <footer
      id="footer-section"
      className="relative flex flex-col-reverse items-center justify-between gap-3 border-t border-[#27292b] bg-black p-2 font-['SF_Pro_Display'] lg:flex-row lg:gap-0"
    >
      {/* Left section - Live status + Trading mode */}
      <div className="flex w-full items-center justify-between gap-4 lg:w-auto lg:justify-start lg:gap-10">
        {/* Live indicator */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="h-2.5 w-2.5 shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="5" fill="#63eb97" />
            </svg>
          </div>
          <p className="text-sm leading-5 text-[#fefefc]">Live</p>
        </div>

        {/* Trading mode */}
        <div className="flex shrink-0 items-center gap-2 lg:gap-4">
          <p className="whitespace-pre text-xs leading-5 text-[#898b8d] lg:text-sm">
            Trading mode:
          </p>
          <div className="flex items-center gap-0.5 rounded-md border border-[#27292b] bg-[#141414] p-0.5">
            <div className="flex items-center justify-center px-1.5 py-0.5">
              <p className="whitespace-pre text-xs leading-4 text-[#fefefc]">Basic</p>
            </div>
            <div className="flex items-center justify-center rounded-md bg-[#fefefc] px-1.5 py-0.5">
              <p className="whitespace-pre text-xs leading-4 text-black">Pro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Center - Copyright */}
      <div className="order-3 w-full text-center lg:absolute lg:left-1/2 lg:top-1/2 lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2">
        <p className="whitespace-pre text-xs leading-5 text-[#7e8180] lg:text-sm">
          Copyright © 2025 Pre-TGE. All rights reserved.
        </p>
      </div>

      {/* Right section - Social icons */}
      <div className="flex shrink-0 items-center gap-4">
        <button
          onClick={() => handleSocialClick(SOCIAL_LINKS.twitter)}
          className="h-5 w-5 cursor-pointer transition-opacity hover:opacity-80"
          aria-label="Follow us on X (Twitter)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-full w-full">
            <g fill="none" fillRule="evenodd">
              <path d="M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z" />
              <path
                fill="#fefefc"
                d="M19.753 4.659a1 1 0 0 0-1.506-1.317l-5.11 5.84L8.8 3.4A1 1 0 0 0 8 3H4a1 1 0 0 0-.8 1.6l6.437 8.582-5.39 6.16a1 1 0 0 0 1.506 1.317l5.11-5.841L15.2 20.6a1 1 0 0 0 .8.4h4a1 1 0 0 0 .8-1.6l-6.437-8.582 5.39-6.16ZM16.5 19 6 5h1.5L18 19z"
              />
            </g>
          </svg>
        </button>

        <button
          onClick={() => handleSocialClick(SOCIAL_LINKS.discord)}
          className="h-5 w-5 cursor-pointer transition-opacity hover:opacity-80"
          aria-label="Join our Discord"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-full w-full">
            <path
              fill="#fefefc"
              d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"
            />
          </svg>
        </button>

        <button
          onClick={() => handleSocialClick(SOCIAL_LINKS.telegram)}
          className="h-5 w-5 cursor-pointer transition-opacity hover:opacity-80"
          aria-label="Join our Telegram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-full w-full">
            <path
              fill="#fefefc"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
}
