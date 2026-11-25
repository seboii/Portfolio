import type { Locale } from "../content"
import "../styles/bridge-meeting-motion.css"

interface BridgeMeetingMotionProps {
  phase: "meeting" | "screenshare"
  locale: Locale
  active?: boolean
}

function ParticipantAvatar() {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle className="bridge-guest-avatar-ring" cx="50" cy="50" r="46" />
      <circle cx="50" cy="39" r="12" fill="currentColor" fillOpacity=".9" />
      <path
        d="M27 74c0-13 10-21 23-21s23 8 23 21"
        fill="currentColor"
        fillOpacity=".9"
      />
    </svg>
  )
}

function MutedMicrophone() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m4 3 12 14M8 5V4a2 2 0 0 1 4 0v5M8 9v1a2 2 0 0 0 3.4 1.4M5 8v2a5 5 0 0 0 8.6 3.5M15 8v2M10 15v3M7 18h6" />
    </svg>
  )
}

export default function BridgeMeetingMotion({
  phase,
  locale,
  active = true,
}: BridgeMeetingMotionProps) {
  const participant = { tr: "Katılımcı", en: "Participant", ru: "Участник" }[
    locale
  ]
  const joined = { tr: "katıldı", en: "joined", ru: "присоединился" }[locale]

  return (
    <div
      className={`bridge-meeting-motion bridge-meeting-motion--${phase}`}
      data-bridge-motion={phase}
      data-active={active}
      aria-hidden="true"
    >
      {phase === "meeting" ? (
        <>
          <div className="bridge-participant-count">
            {[1, 2, 3].map((number) => (
              <span
                className={`bridge-participant-count-value bridge-participant-count-value--${number}`}
                key={number}
              >
                {number}{" "}
                {
                  {
                    tr: "katılımcı",
                    en: number === 1 ? "participant" : "participants",
                    ru: number === 1 ? "участник" : "участника",
                  }[locale]
                }
              </span>
            ))}
          </div>
          {[2, 3].map((number) => (
            <div
              className={`bridge-guest bridge-guest--${number}`}
              data-bridge-participant={number}
              key={number}
            >
              <span className="bridge-guest-camera">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M7 5h5a2 2 0 0 1 2 2v1l3-2v8l-3-2v1M4 6v7a2 2 0 0 0 2 2h6M3 3l14 14" />
                </svg>
              </span>
              <div className="bridge-guest-avatar">
                <ParticipantAvatar />
              </div>
              <div className="bridge-guest-label">
                {participant} 0{number}
              </div>
              <span className="bridge-guest-muted">
                <MutedMicrophone />
              </span>
            </div>
          ))}
          <div className="bridge-join-notices">
            {[2, 3].map((number) => (
              <span
                className={`bridge-join-notice bridge-join-notice--${number}`}
                key={number}
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m3 8 3 3 7-7" />
                </svg>
                {participant} 0{number} {joined}
              </span>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="bridge-share-outline">
            <span className="bridge-share-sweep" />
            <i className="bridge-share-corner bridge-share-corner--start" />
            <i className="bridge-share-corner bridge-share-corner--end" />
          </div>
          <svg
            className="bridge-share-activity"
            viewBox="0 0 1907 927"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="bridge-share-annotation"
              d="M1080 220c50 30 90 54 130 42s80-18 118-20q72 78 64 188"
              pathLength="1"
            />
            <g className="bridge-share-cursor">
              <circle className="bridge-share-click" cx="0" cy="0" r="17" />
              <path d="M0 0v29l8-7 6 13 7-3-6-12 12-1Z" />
            </g>
          </svg>
        </>
      )}
    </div>
  )
}
