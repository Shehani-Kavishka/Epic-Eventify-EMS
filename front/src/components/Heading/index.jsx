import React from "react";

const sizes = {
  xs: "text-[25px] font-extrabold leading-5 md:text-[23px] sm:text-[21px]",
};

const Heading = ({ children, className = "", size = "xs", as, ...restProps }) => {
  const Component = as || "h6";

  return (
    <Component className={`text-white-A700 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };
