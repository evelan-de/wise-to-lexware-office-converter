export function EvelanBadge() {
  return (
    <a
      href="https://evelan.de/"
      target="_blank"
      rel="noopener noreferrer"
      title="Made by Evelan"
      className="group inline-flex"
    >
      <div className="relative flex w-fit flex-row items-center justify-center gap-2 rounded border border-gray-300 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-gray-700 z-[1] cursor-pointer overflow-hidden transition-all duration-300 hover:border-gray-400 hover:shadow-md before:absolute before:inset-0 before:-z-[1] before:w-full before:bg-[radial-gradient(229.58%_356.64%_at_-50.55%_-44.44%,_#FFE288_0%,_#FBD97F_8.37%,_#EFC268_21.89%,_#DD9B43_38.75%,_#D3872F_46.47%,_#603813_100%)] before:opacity-0 before:transition-opacity before:duration-300 before:ease-linear before:content-[''] hover:before:opacity-100 group-hover:text-white">
        <span className="transition-colors duration-300">Made by</span>
        <svg
          width="79"
          height="19"
          viewBox="0 0 79 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[18px] w-[79px]"
        >
          <path
            d="M24.392 3.3125L19.8684 12.8232L15.3049 3.3125H12.6238L18.4993 15.3691H21.2831L27.1186 3.3125H24.392ZM28.385 3.3125H39.7196V5.87051H28.3907L28.385 3.3125ZM28.385 8.07089H39.7196V10.6168H28.3907L28.385 8.07089ZM28.385 12.8111H39.7196V15.3691H28.3907L28.385 12.8111ZM43.9979 13.1505V3.3125H41.5793V15.3691H50.4952L50.7862 14.7629L51.5791 13.1324L43.9979 13.1505ZM66.3819 15.3691H63.6495L59.086 5.85839L54.5625 15.3691H51.8358L52.8854 13.2112L57.6941 3.3125H60.4779L66.3819 15.3691ZM67.6483 15.1933V15.3691H67.7395L67.6483 15.1933ZM0 3.3125H11.3289V5.85839H0V3.3125ZM0 8.07089H11.3289V10.6107H0V8.07089ZM0 12.8293H11.3289V15.3691H0V12.8293ZM76.5813 3.3125V11.8352L70.1069 3.3125H67.6483V15.3691H70.0612V6.88281L76.5414 15.3691H79V3.3125H76.5813Z"
            className="fill-gray-700 group-hover:fill-white transition-colors duration-300"
          />
        </svg>
      </div>
    </a>
  );
}
