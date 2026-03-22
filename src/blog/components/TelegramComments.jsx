import { useEffect, useRef, useState } from "react"

export default function TelegramComments({ telegramUrl }) {
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef(null)
  const discussion = telegramUrl?.replace(/^https?:\/\/t\.me\//, "")

  useEffect(() => {
    if (!expanded || !discussion || !containerRef.current) return
    containerRef.current.innerHTML = ""
    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-widget.js?22"
    script.async = true
    script.setAttribute("data-telegram-discussion", discussion)
    script.setAttribute("data-comments-limit", "5")
    script.setAttribute("data-colorful", "1")
    script.setAttribute("data-dark", "1")
    containerRef.current.appendChild(script)
  }, [expanded, discussion])

  if (!discussion) return null

  return (
    <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-3">

      {/* Полностью своя кнопка */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/20 hover:border-[#229ED9]/50 transition-all cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#229ED9">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.1 13.116l-2.968-.924c-.645-.204-.657-.645.136-.953l11.57-4.461c.537-.194 1.006.131.836.952l.22-.509z"/>
          </svg>
          <span className="text-[11px] font-futura font-bold uppercase tracking-widest text-[#229ED9]/70">
            {expanded ? "Скрыть" : "Обсудить в Telegram"}
          </span>
          <span className={`text-[#229ED9]/40 text-xs transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>▾</span>
        </button>

        <div className="flex-1 h-px bg-white/[0.04]" />

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-white/20 hover:text-[#229ED9]/60 font-futura transition-colors"
        >
          ↗ открыть пост
        </a>
      </div>

      {/* Сам виджет — всё ещё стандартный внутри, но снаружи твой стиль */}
      {expanded && (
        <div
          ref={containerRef}
          className="opacity-80 hover:opacity-100 transition-opacity"
          style={{ colorScheme: "dark" }}
        />
      )}
    </div>
  )
}

// export default function TelegramComments({ telegramUrl }) {
//   const [expanded, setExpanded] = useState(false)
//   const containerRef = useRef(null)
//   const discussion = telegramUrl?.replace(/^https?:\/\/t\.me\//, "")

//   useEffect(() => {
//     if (!expanded || !discussion || !containerRef.current) return
//     containerRef.current.innerHTML = ""
//     const script = document.createElement("script")
//     script.src = "https://telegram.org/js/telegram-widget.js?22"
//     script.async = true
//     script.setAttribute("data-telegram-discussion", discussion)
//     script.setAttribute("data-comments-limit", "5")
//     script.setAttribute("data-colorful", "1")
//     script.setAttribute("data-dark", "1")
//     containerRef.current.appendChild(script)
//   }, [expanded, discussion])

//   if (!discussion) return null

//   return (
//     <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-3">

//       {/* Полностью своя кнопка */}
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => setExpanded(v => !v)}
//           className="flex items-center gap-2 px-3 py-1.5 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/20 hover:border-[#229ED9]/50 transition-all cursor-pointer"
//         >
//           <svg width="12" height="12" viewBox="0 0 24 24" fill="#229ED9">
//             <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.1 13.116l-2.968-.924c-.645-.204-.657-.645.136-.953l11.57-4.461c.537-.194 1.006.131.836.952l.22-.509z"/>
//           </svg>
//           <span className="text-[11px] font-['Barlow_Condensed'] font-bold uppercase tracking-widest text-[#229ED9]/70">
//             {expanded ? "Скрыть" : "Обсудить в Telegram"}
//           </span>
//           <span className={`text-[#229ED9]/40 text-xs transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>▾</span>
//         </button>

//         <div className="flex-1 h-px bg-white/[0.04]" />

        
//         <a
//           href={telegramUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-[10px] text-white/20 hover:text-[#229ED9]/60 font-['Barlow'] transition-colors"
//         >
//           ↗ открыть пост
//         </a>
//       </div>

//       {/* Сам виджет — всё ещё стандартный внутри, но снаружи твой стиль */}
//       {expanded && (
//         <div
//           ref={containerRef}
//           className="opacity-80 hover:opacity-100 transition-opacity"
//           style={{ colorScheme: "dark" }}
//         />
//       )}
//     </div>
//   )
// }
// import { useEffect, useRef, useState } from "react"

// export default function TelegramComments({ telegramUrl, dark = true }) {
//   const containerRef = useRef(null)
//   const [expanded, setExpanded] = useState(false)

//   const discussion = telegramUrl
//     ? telegramUrl.replace(/^https?:\/\/t\.me\//, "")
//     : null

//   useEffect(() => {
//     if (!expanded || !discussion || !containerRef.current) return

//     containerRef.current.innerHTML = ""

//     const script = document.createElement("script")
//     script.src = "https://telegram.org/js/telegram-widget.js?22"
//     script.async = true
//     script.setAttribute("data-telegram-discussion", discussion)
//     script.setAttribute("data-comments-limit", "5")
//     script.setAttribute("data-colorful", "1")
//     if (dark) script.setAttribute("data-dark", "1")

//     containerRef.current.appendChild(script)

//     return () => {
//       if (containerRef.current) containerRef.current.innerHTML = ""
//     }
//   }, [expanded, discussion, dark])

//   if (!discussion) return null

//   return (
//     <div className="pt-3 border-t border-white/[0.06]">
//       <div className="flex items-center gap-2">

//         {/* Кнопка раскрыть/скрыть комментарии */}
//         <button
//           onClick={() => setExpanded(v => !v)}
//           className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-white/60 font-['Barlow'] uppercase tracking-wide transition-colors cursor-pointer"
//         >
//           <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.1 13.116l-2.968-.924c-.645-.204-.657-.645.136-.953l11.57-4.461c.537-.194 1.006.131.836.952l.22-.509z"/>
//           </svg>
//           {expanded ? "Скрыть" : "Комментарии"}
//         </button>

//         <div className="flex-1 h-px bg-white/[0.04]" />

//         {/* Прямая ссылка на пост в ТГ */}
//         <a
//           href={telegramUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-[10px] text-white/20 hover:text-[#229ED9]/70 font-['Barlow'] transition-colors"
//         >
//           ↗ Telegram
//         </a>
//       </div>

//       {/* Виджет — только когда раскрыт */}
//       {expanded && (
//         <div
//           ref={containerRef}
//           className="mt-3 w-full opacity-70 hover:opacity-95 transition-opacity duration-300"
//           style={{ colorScheme: "dark" }}
//         />
//       )}
//     </div>
//   )
// }