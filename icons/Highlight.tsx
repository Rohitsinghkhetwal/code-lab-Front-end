import { ComponentProps } from "react";


export function HighlightIcon(props: ComponentProps<"svg">) {

  return (

    <svg

      width="20"

      height="20"

      viewBox="0 0 20 20"

      fill="currentColor"

      xmlns="http://www.w3.org/2000/svg"

      {...props}

    >

      <path d="M15.993 1.385a1.87 1.87 0 012.623 2.622l-4.03 5.27a12.749 12.749 0 01-4.237 3.562 4.508 4.508 0 00-3.188-3.188 12.75 12.75 0 013.562-4.236l5.27-4.03zM6 11a3 3 0 00-3 3 .5.5 0 01-.72.45.75.75 0 00-1.035.931A4.001 4.001 0 009 14.004V14a3.01 3.01 0 00-1.66-2.685A2.99 2.99 0 006 11z" />

    </svg>

  );

}