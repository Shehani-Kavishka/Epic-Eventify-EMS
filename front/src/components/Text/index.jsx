import React from "react";

const sizes = {
  xs: "text-xs font-normal",
  lg: "text-lg font-normal leading-[22px]",
  s: "text-[13px] font-normal leading-5",
  "2xl": "text-3xl font-normal leading-[37px] md:text-[28px] sm:text-[26px]",
  xl: "text-xl font-normal leading-[150%]",
  md: "text-[15px] font-normal leading-[19px]",
};

const Text = ({ children, className = "", as, size = "xs", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-black-900_02 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
