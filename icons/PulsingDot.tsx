export const PulsingDot = (props: { color: string }) => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="20"
      cy="20"
      fill="none"
      r="10"
      stroke="currentcolor"
      strokeWidth="2"
    >
      <animate
        attributeName="r"
        from="8"
        to="20"
        dur="1.5s"
        begin="0s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        from="1"
        to="0"
        dur="1.5s"
        begin="0s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="20" cy="20" fill="currentcolor" r="10" />
  </svg>
);
