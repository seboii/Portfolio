import type { Locale } from "../content"

interface EarlierSystemProps {
  projectId: string
  locale: Locale
}

function Mailops({ locale }: { locale: Locale }) {
  return (
    <svg
      className="scene-svg earlier-art earlier-mailops"
      viewBox="0 0 800 500"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="#A8AFBA" strokeOpacity=".11">
        <ellipse cx="410" cy="250" rx="345" ry="180" />
        <path d="M60 250H744M405 65V430" strokeDasharray="3 10" />
      </g>
      <g fill="none" stroke="#B7D9E7" strokeWidth="1.8" strokeOpacity=".65">
        <path d="M212 212Q260 95 370 114M472 124Q584 137 620 215M609 295Q571 381 455 382" />
        <path d="m360 105 12 9-14 5m260 84 3 13-12-7m-143 166-14 7 13 7" />
      </g>
      <g transform="translate(75 170)">
        <path
          d="M0 0H140V94H0Z"
          fill="#182128"
          stroke="#B7D9E7"
          strokeWidth="1.7"
        />
        <path
          d="m0 0 70 54 70-54M0 94l44-43m96 43-44-43"
          fill="none"
          stroke="#B7D9E7"
          strokeWidth="1.5"
        />
        <path
          d="M-12-15H127V-8"
          fill="none"
          stroke="#B7D9E7"
          strokeOpacity=".25"
        />
        <text x="70" y="133" textAnchor="middle" fill="#F3F1E9" fontSize="23">
          {{ tr: "E-posta", en: "Email", ru: "Почта" }[locale]}
        </text>
        <text
          x="70"
          y="160"
          textAnchor="middle"
          fill="#A8AFBA"
          fontSize="18"
          className="svg-mono"
        >
          GRAPH
        </text>
      </g>
      <g transform="translate(366 80)">
        <path
          d="M0 0H114V80H0Z"
          fill="#182128"
          stroke="#B7D9E7"
          strokeWidth="1.5"
        />
        {[20, 47, 74].map((x) => (
          <path
            key={x}
            d={`M${x} 22h19v34h-19Z`}
            fill="#B7D9E7"
            fillOpacity=".15"
            stroke="#B7D9E7"
          />
        ))}
        <path d="M8 69H104" stroke="#B7D9E7" strokeOpacity=".3" />
        <text x="57" y="-18" textAnchor="middle" fill="#F3F1E9" fontSize="23">
          {{ tr: "İş kuyruğu", en: "Work queue", ru: "Очередь задач" }[locale]}
        </text>
        <text
          x="57"
          y="112"
          textAnchor="middle"
          fill="#A8AFBA"
          fontSize="18"
          className="svg-mono"
        >
          RABBITMQ
        </text>
      </g>
      <g transform="translate(577 203)">
        <path
          d="m41 0 41 23v47L41 94 0 70V23Z"
          fill="#182128"
          stroke="#B7D9E7"
          strokeWidth="1.8"
        />
        <path
          d="M0 23l41 25 41-25M41 48v46"
          fill="none"
          stroke="#B7D9E7"
          strokeOpacity=".3"
        />
        <path
          d="m26 31 10 10 20-21M24 63h33"
          fill="none"
          stroke="#D7FF64"
          strokeWidth="2"
        />
        <text x="41" y="129" textAnchor="middle" fill="#F3F1E9" fontSize="23">
          {
            {
              tr: "Temizle / analiz et",
              en: "Clean / analyze",
              ru: "Очистка / анализ",
            }[locale]
          }
        </text>
        <text
          x="41"
          y="157"
          textAnchor="middle"
          fill="#A8AFBA"
          fontSize="18"
          className="svg-mono"
        >
          PYTHON
        </text>
      </g>
      <g transform="translate(332 291)">
        <path
          d="M0 0H90l24 24v108H0Z"
          fill="#182128"
          stroke="#B7D9E7"
          strokeWidth="1.6"
        />
        <path
          d="M90 0v24h24M20 43h72M20 61h52M20 100V82h16v18m13 0V74h16v26m13 0V66h16v34"
          fill="none"
          stroke="#B7D9E7"
          strokeWidth="1.6"
        />
        <text x="57" y="-17" textAnchor="middle" fill="#F3F1E9" fontSize="23">
          {
            {
              tr: "Kayıt / rapor",
              en: "Record / report",
              ru: "Запись / отчёт",
            }[locale]
          }
        </text>
      </g>
    </svg>
  )
}

function OtoMARK({ locale }: { locale: Locale }) {
  return (
    <svg
      className="scene-svg earlier-art earlier-otomark"
      viewBox="0 0 800 500"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="#A8AFBA" strokeOpacity=".1">
        <path d="M42 410 352 190 753 340 444 481ZM100 408 356 226 691 351" />
        <path
          d="M91 357 487 482M165 303 564 453M235 252 636 402"
          strokeDasharray="3 9"
        />
      </g>
      <g transform="translate(70 190)">
        <path
          d="M0 32 257-64 397 14 139 112Z"
          fill="#17211D"
          stroke="#728378"
          strokeOpacity=".35"
        />
        <path
          d="M21 37 147 109m-63-97 127 73m-63-97 127 73m-63-97 127 73M19 34 257-55"
          fill="none"
          stroke="#D7FF64"
          strokeWidth="2"
          strokeOpacity=".5"
        />
        <g transform="translate(66 18)">
          <path
            d="m0 0 38-14 59 33-38 14Z"
            fill="#466050"
            stroke="#A8AFBA"
            strokeOpacity=".5"
          />
          <path
            d="m15-3 22-8 24 14-22 8Zm28 16 22-8 19 11-22 8Z"
            fill="#9BACAB"
            fillOpacity=".4"
          />
          <path
            d="M0 0v15l59 34 38-14V19M59 33v16"
            fill="none"
            stroke="#92A89B"
          />
          <path d="m5 15 8 5m67 11 8-3" stroke="#F3F1E9" strokeWidth="3" />
        </g>
        <g transform="translate(186 -26)">
          <path
            d="m0 0 38-14 59 33-38 14Z"
            fill="#344047"
            stroke="#A8AFBA"
            strokeOpacity=".5"
          />
          <path
            d="m15-3 22-8 24 14-22 8Zm28 16 22-8 19 11-22 8Z"
            fill="#A6BDCA"
            fillOpacity=".3"
          />
          <path
            d="M0 0v15l59 34 38-14V19M59 33v16"
            fill="none"
            stroke="#718994"
          />
          <path d="m5 15 8 5m67 11 8-3" stroke="#F3F1E9" strokeWidth="3" />
        </g>
      </g>
      <g transform="translate(459 93)">
        <path
          d="M0 0H279V226H0Z"
          fill="#14191F"
          stroke="#8C9B91"
          strokeWidth="1.5"
        />
        <path
          d="M0 33H279M100 226v28h78v-28M67 259h144"
          fill="none"
          stroke="#8C9B91"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="17" r="3" fill="#D7FF64" />
        <circle cx="30" cy="17" r="3" fill="#718078" />
        <circle cx="44" cy="17" r="3" fill="#718078" />
        <text
          x="139"
          y="94"
          textAnchor="middle"
          fill="#D7FF64"
          fontSize="44"
          className="svg-mono"
        >
          C++
        </text>
        <path
          d="M60 119h160M60 141h126M60 163h147"
          stroke="#A8AFBA"
          strokeOpacity=".25"
          strokeWidth="2"
        />
        <text x="139" y="195" textAnchor="middle" fill="#F3F1E9" fontSize="22">
          {
            { tr: "Çekirdek mantık", en: "Core logic", ru: "Основная логика" }[
              locale
            ]
          }
        </text>
      </g>
      <path
        d="M295 289Q365 374 487 337"
        fill="none"
        stroke="#D7FF64"
        strokeWidth="1.5"
        strokeDasharray="4 7"
        strokeOpacity=".5"
      />
      <text x="94" y="381" fill="#F3F1E9" fontSize="24">
        {
          {
            tr: "Otopark / masaüstü uygulaması",
            en: "Parking / desktop application",
            ru: "Парковка / настольное приложение",
          }[locale]
        }
      </text>
      <text x="94" y="413" fill="#A8AFBA" fontSize="18" className="svg-mono">
        {
          {
            tr: "TASARIM · MANTIK · TEST KATKISI",
            en: "DESIGN · LOGIC · TEST CONTRIBUTION",
            ru: "ВКЛАД В ДИЗАЙН · ЛОГИКУ · ТЕСТЫ",
          }[locale]
        }
      </text>
    </svg>
  )
}

export default function EarlierSystem({
  projectId,
  locale,
}: EarlierSystemProps) {
  if (projectId === "mailops") return <Mailops locale={locale} />
  if (projectId === "otomark") return <OtoMARK locale={locale} />
  return null
}
