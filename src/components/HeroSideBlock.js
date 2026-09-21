import Image from 'next/image'
import Link from 'next/link'

export default function HeroSideBlock({ block, side, preview = false }) {
  const text = block && <>
    <h3 className="text-white font-bold text-sm md:text-base mb-1">{block.title}</h3>
    <p className="text-white/90 text-xs md:text-sm">{block.subtitle}</p>
  </>
  return (
    <div className={`${preview ? 'w-full h-40' : 'w-full lg:w-1/5 h-32 md:h-40 lg:h-[540px]'} rounded-lg border-1 flex-shrink-0 relative overflow-hidden ${side === 'left' ? 'bg-white shadow gap-3' : ''}`}>
      {block?.active && <>
        <Image src={block.image} alt={block.alt || block.title} width={300} height={500} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-t ${side === 'left' ? 'from-black/60' : 'from-blue-900/70'} to-transparent flex flex-col justify-end p-3 md:p-4`}>
          {block.link ? <Link href={block.link}>{text}</Link> : text}
        </div>
      </>}
    </div>
  )
}
