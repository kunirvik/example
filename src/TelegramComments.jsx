import { useEffect, useRef } from "react"


export default function TelegramComments({ telegramUrl, dark = true }) {
  const containerRef = useRef(null)

  // Извлекаем "channelname/postId" из полного URL
  const discussion = telegramUrl
    ? telegramUrl.replace(/^https?:\/\/t\.me\//, "")
    : null

  useEffect(() => {
    if (!discussion || !containerRef.current) return

    // Очищаем контейнер при смене поста
    containerRef.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-widget.js?22"
    script.async = true
    script.setAttribute("data-telegram-discussion", discussion)
    script.setAttribute("data-comments-limit", "5")
    script.setAttribute("data-colorful", "1")
    if (dark) script.setAttribute("data-dark", "1")

    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ""
    }
  }, [discussion, dark])

  if (!discussion) return null

  return (
    <div className="pt-4 border-t border-white/10">
      {/* Заголовок секции */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 bg-[#229ED9]" />
        <span className="font-['Barlow_Condensed'] font-black text-[10px] uppercase tracking-[0.2em] text-white/40">
          Comments
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-[#229ED9] hover:text-[#229ED9]/80 font-['Barlow'] uppercase tracking-wide transition-colors"
        >
          {/* Telegram logo */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.1 13.116l-2.968-.924c-.645-.204-.657-.645.136-.953l11.57-4.461c.537-.194 1.006.131.836.952l.22-.509z"/>
          </svg>
          Open in Telegram
        </a>
      </div>

      {/* Контейнер виджета */}
      <div
        ref={containerRef}
        className="w-full min-h-[80px] flex items-start"
        style={{ colorScheme: dark ? "dark" : "light" }}
      />
    </div>
  )
}