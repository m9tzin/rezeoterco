import { RosaryLogo } from './RosaryLogo'
import { DonationNavButton } from './DonationBanner'

type Props = {
  onShowSelection: () => void
  onShowWelcome: () => void
}

export function TopNav({ onShowSelection, onShowWelcome }: Props) {
  return (
    <nav aria-label="Navegação principal" className="flex flex-wrap justify-end sm:gap-x-1 mb-6">
      <DonationNavButton />
      <button
        type="button"
        onClick={onShowSelection}
        aria-label="Menu"
        className="font-cormorant text-base text-terco-muted min-h-[44px] px-2 sm:px-3 whitespace-nowrap inline-flex items-center gap-2 transition-all duration-200 motion-safe:ease-out [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:text-brown"
      >
        <RosaryLogo width={13} className="shrink-0 opacity-80" />
        Menu
      </button>
      <button
        type="button"
        onClick={onShowWelcome}
        aria-label="Como rezar"
        className="inline-flex items-center gap-2 font-cormorant text-base text-terco-muted min-h-[44px] px-2 sm:px-3 whitespace-nowrap transition-all duration-200 motion-safe:ease-out [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:text-brown"
      >
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full border border-gold/50 bg-white/60 font-cormorant text-sm text-gold"
          aria-hidden="true"
        >
          ?
        </span>
        Como rezar
      </button>
    </nav>
  )
}
