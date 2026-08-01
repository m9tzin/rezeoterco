import { getVersiculoDoDia } from '@/data/versiculos'

type Props = {
  date?: Date
}

export function VerseOfDay({ date }: Props) {
  const versiculo = getVersiculoDoDia(date)

  return (
    <section
      aria-labelledby="versiculo-do-dia"
      className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mb-7 border border-gold/30 rounded-sm px-5 py-5 bg-white/80 shadow-[0_1px_10px_rgba(92,61,46,0.06)] text-left"
    >
      <p
        id="versiculo-do-dia"
        className="font-cormorant text-sm uppercase tracking-[0.22em] text-gold mb-3"
      >
        Versículo do dia
      </p>
      <blockquote className="font-garamond italic text-xl leading-relaxed text-terco-text mb-3">
        “{versiculo.texto}”
      </blockquote>
      <p className="font-cormorant text-sm text-brown mb-3">{versiculo.referencia}</p>
      <p className="font-garamond text-base leading-relaxed text-terco-muted">
        {versiculo.reflexao}
      </p>
    </section>
  )
}
