import type { Locale } from "../content"

export default function CollaborationScene({ locale }: { locale: Locale }) {
  return (
    <svg
      className="scene-svg collaboration-art"
      viewBox="0 0 1160 760"
      aria-hidden="true"
      focusable="false"
      data-ambient-scene="collaboration"
    >
      <g className="peer-lines" fill="none" stroke="#92BCD4" strokeWidth="1.3">
        <path className="draw-path" d="M302 303Q546 79 872 298" />
        <path className="draw-path" d="M305 313Q516 644 870 327" />
        <path
          className="draw-path"
          d="M333 316H812"
          strokeDasharray="4 7"
          strokeOpacity=".4"
        />
      </g>
      <g
        className="ambient-links"
        fill="none"
        stroke="#92BCD4"
        strokeOpacity=".15"
      >
        <path data-ambient-path="0" d="M302 303Q546 79 872 298" />
        <path data-ambient-path="1" d="M305 313Q516 644 870 327" />
      </g>
      <g className="ambient-signals" fill="#92BCD4">
        <circle data-ambient-packet="0" cx="302" cy="303" r="5" />
        <circle data-ambient-packet="1" cx="305" cy="313" r="5" />
      </g>
      <g className="peer-presence" fill="#92BCD4">
        <circle cx="490" cy="189" r="4" />
        <circle cx="690" cy="451" r="4" />
        <circle cx="545" cy="317" r="3" />
      </g>
      <g className="participant participant-a" transform="translate(120 150)">
        <path
          d="M0 0H355V342H0Z"
          fill="#182128"
          stroke="#92BCD4"
          strokeOpacity=".3"
        />
        <path d="M0 0H355V6H0Z" fill="#92BCD4" fillOpacity=".5" />
        <circle cx="177" cy="133" r="47" fill="#314550" />
        <path d="M73 289Q88 203 177 205T282 289Z" fill="#2A3B44" />
        <path
          d="M146 111L194 89 204 139 173 171 148 148Z"
          fill="#506772"
          opacity=".5"
        />
        <text x="22" y="35" fill="#A8AFBA" fontSize="11" className="svg-mono">
          {
            { tr: "KATILIMCI / A", en: "PARTICIPANT / A", ru: "УЧАСТНИК / A" }[
              locale
            ]
          }
        </text>
        <g
          className="waveform"
          transform="translate(107 306)"
          stroke="#92BCD4"
          strokeWidth="3"
        >
          {[8, 18, 12, 30, 21, 39, 26, 15, 23, 9].map((h, i) => (
            <path key={i} d={"M" + i * 14 + " " + -h / 2 + "V" + h / 2} />
          ))}
        </g>
      </g>
      <g className="participant participant-b" transform="translate(665 172)">
        <path
          d="M0 0H300V280H0Z"
          fill="#1A2529"
          stroke="#92BCD4"
          strokeOpacity=".22"
        />
        <circle cx="150" cy="117" r="41" fill="#405150" />
        <path d="M57 240Q62 177 150 173T243 240Z" fill="#293C3A" />
        <text x="20" y="30" fill="#A8AFBA" fontSize="11" className="svg-mono">
          {
            { tr: "KATILIMCI / B", en: "PARTICIPANT / B", ru: "УЧАСТНИК / B" }[
              locale
            ]
          }
        </text>
        <circle cx="274" cy="25" r="4" fill="#D7FF64" />
      </g>
      <g className="shared-frame" transform="translate(458 438)">
        <path
          d="M0 0H423V192H0Z"
          fill="#14191F"
          stroke="#92BCD4"
          strokeOpacity=".4"
        />
        <text x="20" y="29" fill="#92BCD4" fontSize="11" className="svg-mono">
          {
            { tr: "ORTAK EKRAN", en: "SHARED SCREEN", ru: "ОБЩИЙ ЭКРАН" }[
              locale
            ]
          }
        </text>
        <path
          d="M20 60H180V156H20ZM201 60H401M201 88H365M201 116H388"
          fill="none"
          stroke="#92BCD4"
          strokeOpacity=".2"
        />
        <g className="annotation" fill="none" stroke="#D7FF64" strokeWidth="2">
          <ellipse cx="98" cy="109" rx="61" ry="38" />
          <path d="M167 111L227 89" />
          <path d="M225 84L224 97 237 99" />
        </g>
        <path
          className="remote-cursor"
          d="M295 114L295 144 306 133 318 151 325 145 313 127 328 126Z"
          fill="#D7FF64"
        />
        <g transform="translate(365 93)">
          <g className="ambient-cursor">
            <path d="M0 0V27L9 18 20 34 27 29 16 13 30 12Z" fill="#92BCD4" />
            <circle
              className="ambient-pulse"
              cx="7"
              cy="7"
              r="15"
              fill="none"
              stroke="#92BCD4"
              strokeOpacity=".25"
            />
          </g>
        </g>
      </g>
      <g className="message-stream" transform="translate(104 540)">
        <path d="M0 0H317V78H0Z" fill="#182128" stroke="#33383D" />
        <circle cx="21" cy="22" r="3" fill="#92BCD4" />
        <text x="34" y="26" fill="#A8AFBA" fontSize="10" className="svg-mono">
          {{ tr: "MESAJLAR", en: "MESSAGES", ru: "СООБЩЕНИЯ" }[locale]}
        </text>
        <text x="20" y="54" fill="#F3F1E9" fontSize="16">
          {
            {
              tr: "Aynı bağlamda. Birlikte.",
              en: "One context. Together.",
              ru: "Общий контекст. Вместе.",
            }[locale]
          }
        </text>
        {[24, 176].map((x, index) => (
          <g key={x} transform={`translate(${x} 90)`}>
            <g className="ambient-message" data-ambient-index={index}>
              <path
                d="M10 0H98Q108 0 108 10V12Q108 22 98 22H24L14 30V22H10Q0 22 0 12V10Q0 0 10 0Z"
                fill="#182128"
                stroke="#92BCD4"
                strokeOpacity=".45"
              />
              {[39, 54, 69].map((cx) => (
                <circle key={cx} cx={cx} cy="11" r="2.5" fill="#92BCD4" />
              ))}
            </g>
          </g>
        ))}
      </g>
      <g className="translation-caption" transform="translate(620 655)">
        <path d="M0 0H345" stroke="#92BCD4" strokeOpacity=".4" />
        <text y="28" fill="#92BCD4" fontSize="12" className="svg-mono">
          {
            {
              tr: "İLETİŞİM → ORTAK ÇALIŞMA",
              en: "COMMUNICATION → SHARED WORK",
              ru: "ОБЩЕНИЕ → СОВМЕСТНАЯ РАБОТА",
            }[locale]
          }
        </text>
      </g>
      <g fill="#A8AFBA" fontSize="11" className="svg-mono">
        <text x="104" y="80">
          WEBRTC / SOCKET.IO
        </text>
      </g>
    </svg>
  )
}
