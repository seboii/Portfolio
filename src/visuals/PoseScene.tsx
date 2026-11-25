import { useId } from "react"
import type { Locale } from "../content"

const joints = [
  [560, 167],
  [549, 156],
  [571, 156],
  [536, 163],
  [584, 163],
  [507, 224],
  [613, 224],
  [472, 321],
  [666, 304],
  [415, 391],
  [716, 258],
  [526, 386],
  [599, 386],
  [494, 514],
  [641, 504],
  [461, 647],
  [684, 633],
]
const bones = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [5, 6],
  [5, 7],
  [7, 9],
  [6, 8],
  [8, 10],
  [5, 11],
  [6, 12],
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
]
const silhouette =
  "M559 125C588 125 603 145 599 169C598 192 583 209 572 214L596 226C620 231 632 263 640 287L674 269L701 238L722 250L689 299L651 329C632 337 621 327 612 302L610 354L623 402L657 480L672 524L697 625L683 652L655 651L627 537L603 490L580 422L555 422L533 496L512 531L491 642L474 669L447 660L471 524L479 479L513 402L516 340L509 285L489 329L450 374L426 403L410 387L440 349L469 302L486 248C491 229 512 225 541 212C520 199 516 172 519 153C522 136 538 125 559 125Z"

export default function PoseScene({ locale }: { locale: Locale }) {
  const id = useId()
  return (
    <svg
      className="scene-svg pose-art"
      viewBox="0 0 1160 760"
      aria-hidden="true"
      focusable="false"
      data-ambient-scene="pose"
    >
      <defs>
        <linearGradient id={id} x2=".8" y2="1">
          <stop stopColor="#78908C" stopOpacity=".33" />
          <stop offset="1" stopColor="#293B3F" stopOpacity=".08" />
        </linearGradient>
        <linearGradient id={id + "-scan"} x2="1">
          <stop stopColor="#F09B85" stopOpacity="0" />
          <stop offset=".5" stopColor="#F09B85" />
          <stop offset="1" stopColor="#F09B85" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#8B9B98" strokeOpacity=".1">
        <path d="M150 150H1010M150 280H1010M150 410H1010M150 540H1010M150 670H1010M280 80V695M410 80V695M540 80V695M670 80V695M800 80V695M930 80V695" />
        <path d="M150 695L540 490 1010 695M150 540L540 490 1010 540" />
      </g>
      <g className="motion-trails" fill="none" stroke="#F09B85">
        <path d={silhouette} transform="translate(-46 8)" opacity=".08" />
        <path d={silhouette} transform="translate(-23 4)" opacity=".15" />
      </g>
      <path
        className="human-silhouette"
        d={silhouette}
        fill={"url(#" + id + ")"}
        stroke="#A8AFBA"
        strokeOpacity=".22"
      />
      <g
        className="tracking-box"
        fill="none"
        stroke="#F09B85"
        strokeOpacity=".45"
      >
        <path d="M386 164V104H459M670 104H750V164M386 618V689H459M670 689H750V618" />
        <path
          d="M386 104H750V689H386Z"
          strokeDasharray="3 9"
          strokeOpacity=".16"
        />
      </g>
      <g className="pose-bones" fill="none" stroke="#F09B85" strokeWidth="2">
        {bones.map(([a, b], i) => (
          <path
            key={i}
            className="draw-path"
            d={
              "M" +
              joints[a][0] +
              " " +
              joints[a][1] +
              "L" +
              joints[b][0] +
              " " +
              joints[b][1]
            }
          />
        ))}
      </g>
      <g className="pose-points" fill="#F09B85">
        {joints.map(([x, y], i) => (
          <g key={i} className="pose-keypoint">
            <circle cx={x} cy={y} r="4.5" />
            <circle
              cx={x}
              cy={y}
              r="10"
              fill="none"
              stroke="#F09B85"
              strokeOpacity=".15"
            />
          </g>
        ))}
      </g>
      <path
        className="scan-line"
        d="M325 395H807"
        stroke={"url(#" + id + "-scan)"}
        strokeWidth="2"
      />
      <g className="ambient-scan" data-ambient-distance="430">
        <path
          d="M386 185H750"
          stroke={"url(#" + id + "-scan)"}
          strokeWidth="2.5"
          strokeOpacity=".65"
        />
        <path
          d="M386 185v14M750 185v14"
          stroke="#F09B85"
          strokeWidth="1.5"
          strokeOpacity=".45"
        />
      </g>
      <g className="ambient-tracking" fill="none" stroke="#F09B85">
        {[
          [507, 224],
          [716, 258],
          [526, 386],
        ].map(([x, y], index) => (
          <circle
            key={index}
            className="ambient-pulse"
            cx={x}
            cy={y}
            r="16"
            strokeOpacity=".3"
          />
        ))}
      </g>
      <g className="pose-analysis" transform="translate(795 269)">
        <path d="M0 0H244" stroke="#F09B85" strokeOpacity=".3" />
        <text y="-18" fill="#F09B85" fontSize="13" className="svg-mono">
          {
            {
              tr: "HAREKET → SİNYAL",
              en: "MOVEMENT → SIGNAL",
              ru: "ДВИЖЕНИЕ → СИГНАЛ",
            }[locale]
          }
        </text>
        <text y="35" fill="#F3F1E9" fontSize="27">
          17
        </text>
        <text x="44" y="35" fill="#A8AFBA" fontSize="11" className="svg-mono">
          {
            {
              tr: "COCO / POZ NOKTASI",
              en: "COCO / POSE LANDMARKS",
              ru: "COCO / КЛЮЧЕВЫЕ ТОЧКИ ПОЗЫ",
            }[locale]
          }
        </text>
        <text y="64" fill="#A8AFBA" fontSize="11" className="svg-mono">
          YOLOv8 / MEDIAPIPE
        </text>
        <path d="M0 95H225" stroke="#33383D" />
        <text y="124" fill="#A8AFBA" fontSize="12">
          {
            {
              tr: "Görsel veri. Yapılandırılmış bağlam.",
              en: "Visual data. Structured context.",
              ru: "Визуальные данные. Структурированный контекст.",
            }[locale]
          }
        </text>
      </g>
      <g className="behavior-timeline" transform="translate(132 638)">
        <text y="-30" fill="#A8AFBA" fontSize="11" className="svg-mono">
          {{ tr: "OLAY AKIŞI", en: "EVENT FLOW", ru: "ПОТОК СОБЫТИЙ" }[locale]}
        </text>
        <path d="M0 0H201" stroke="#F09B85" strokeOpacity=".4" />
        {[0, 48, 85, 149, 200].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy="0"
            r={i === 2 ? 5 : 3}
            fill={i === 2 ? "#F09B85" : "#515F61"}
          />
        ))}
        <text y="31" fill="#A8AFBA" fontSize="10" className="svg-mono">
          {
            {
              tr: "GÖZLEM / POZ / ANALİZ",
              en: "OBSERVE / POSE / ANALYZE",
              ru: "НАБЛЮДЕНИЕ / ПОЗА / АНАЛИЗ",
            }[locale]
          }
        </text>
      </g>
      <g fill="#A8AFBA" fontSize="11" className="svg-mono">
        <text x="132" y="64">
          {locale === "ru" ? "ЧЕЛОВЕК → ДАННЫЕ" : "HUMAN → DATA"}
        </text>
      </g>
    </svg>
  )
}
