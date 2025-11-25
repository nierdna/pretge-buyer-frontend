'use client';

import { Button } from '@/components/ui/button';
import { IToken } from '@/types/token';
import { ITokenProjectExternal } from '@/types/tokenProject';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TokenDetailHeaderProps {
  token?: IToken | null;
  tokenExternal?: ITokenProjectExternal | null;
}

export default function TokenDetailHeader({ token, tokenExternal }: TokenDetailHeaderProps) {
  const projectData = tokenExternal?.data;
  const socialLinks = projectData?.socials;
  const web3Project = projectData?.web3Project;

  // Get tags/categories
  const getTags = () => {
    const tags = [];
    if (web3Project?.chain) {
      tags.push({ label: web3Project.chain, color: 'text-emerald-400' });
    }
    if (web3Project?.category) {
      tags.push({ label: web3Project.category, color: 'text-amber-400' });
    }
    if (web3Project?.launchStatus) {
      tags.push({ label: web3Project.launchStatus, color: 'text-orange-400' });
    }
    return tags;
  };

  const tags = getTags();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      {/* Left section: Token info */}
      <div className="flex items-start gap-3 md:gap-4">
        {/* Token logo */}
        <div className="relative h-[50px] w-[50px] shrink-0 overflow-hidden rounded-lg md:h-[60px] md:w-[60px]">
          {token?.logo ? (
            <Image src={token.logo} alt={token.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-card text-2xl font-bold">
              {token?.symbol?.[0] || '?'}
            </div>
          )}
        </div>

        {/* Token details */}
        <div className="flex flex-col gap-3">
          {/* Name and Symbol */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <h1 className="text-xl font-semibold text-primary-text md:text-2xl">
                {token?.name || web3Project?.name || 'Unknown'}
              </h1>
              <span className="text-xl font-semibold text-secondary-text md:text-2xl">
                {token?.symbol || web3Project?.symbol || 'N/A'}
              </span>
            </div>

            {/* Divider */}
            <div className="hidden h-7 w-[1px] bg-border md:block" />

            {/* Social links */}
            <div className="flex items-center gap-2 md:gap-3">
              {(socialLinks?.twitter || token?.twitterUrl) && (
                <Link
                  href={socialLinks?.twitter || token?.twitterUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-text transition-colors hover:text-primary-text"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11.9 8.6L19.3 0h-1.7l-6.5 7.4L6.4 0H0l7.8 11.3L0 20h1.7l6.8-7.8L13.6 20H20l-8.1-11.4zm-2.4 2.7l-.8-1.1L2.3 1.3h2.7l5.2 7.4.8 1.1 6.5 9.3h-2.7l-5.5-7.8z" />
                  </svg>
                </Link>
              )}
              {(socialLinks?.discord || token?.telegramUrl) && (
                <Link
                  href={socialLinks?.discord || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-text transition-colors hover:text-primary-text"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
                  </svg>
                </Link>
              )}
              {(socialLinks?.telegram || token?.telegramUrl) && (
                <Link
                  href={socialLinks?.telegram || token?.telegramUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-text transition-colors hover:text-primary-text"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c-.01.06.01.24 0 .38z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="max-w-2xl text-xs text-secondary-text md:text-sm">
            {web3Project?.description ||
              token?.websiteUrl ||
              "Plasma is a high-throughput execution environment for Bitcoin that enables 1,000 transactions per second while inheriting Bitcoin's security."}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="rounded-full border border-border bg-card px-2 py-1 text-xs font-medium"
              >
                <span className={tag.color}>{tag.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right section: Create Order button */}
      <Button variant={'primary'} className="md:w-auto">
        <Plus className="h-3.5 w-3.5" />
        Create Order
      </Button>
    </div>
  );
}
