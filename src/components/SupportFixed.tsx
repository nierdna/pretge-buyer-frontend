import { BookOpen } from 'lucide-react';
import { FaDiscord, FaHeadset } from 'react-icons/fa';

const SupportFixed = () => {
  return (
    <div className="group fixed left-0 top-1/2 z-50 -translate-x-[calc(100%-30px)] -translate-y-1/2 transition-all duration-300 hover:translate-x-0">
      <div className="flex overflow-hidden rounded-r-lg bg-card shadow-lg">
        {/* Expanded content */}
        <div className="flex flex-col">
          <a
            href="https://discord.gg/pretgemarket"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 text-white transition-colors hover:bg-foreground/50"
          >
            <FaDiscord className="h-4 w-4 text-white" />
            <span className="text-sm font-normal">Discord</span>
          </a>
          <a
            href="https://x.com/pretgemarket"
            target="_blank"
            className="flex items-center gap-3 border-t border-border px-3 py-2 text-white transition-colors hover:bg-foreground/50"
          >
            <div className="h-[18px] w-[18px] text-secondary-text">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>social_x_line</title>
                <g id="social_x_line" fill="none" fillRule="evenodd">
                  <path d="M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M19.753 4.659a1 1 0 0 0-1.506-1.317l-5.11 5.84L8.8 3.4A1 1 0 0 0 8 3H4a1 1 0 0 0-.8 1.6l6.437 8.582-5.39 6.16a1 1 0 0 0 1.506 1.317l5.11-5.841L15.2 20.6a1 1 0 0 0 .8.4h4a1 1 0 0 0 .8-1.6l-6.437-8.582 5.39-6.16ZM16.5 19 6 5h1.5L18 19z"
                  />
                </g>
              </svg>
            </div>
            <span className="text-sm font-normal">Twitter</span>
          </a>
          <a
            href="https://x.com/pretgemarket"
            target="_blank"
            className="flex items-center gap-3 border-t border-border px-3 py-2 text-white transition-colors hover:bg-foreground/50"
          >
            <BookOpen className="h-[18px] w-[18px] text-secondary-text" />
            <span className="text-sm font-normal">Help Center</span>
          </a>
        </div>
        {/* Support Icon - visible when collapsed */}
        <div className="flex w-[30px] items-center justify-center border-l border-border text-white">
          <FaHeadset className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
};

export default SupportFixed;
