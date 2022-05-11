/* eslint-disable react/jsx-props-no-spreading */
import clsx from 'clsx';
import React from 'react';

const Input = ({ placeholder, icon, ...props }: IProps) => {
  return (
    <div className="bg-secondary block relative w-full ">
      <input
        className={clsx(
          'shadow-sm outline-none rounded-md border border-border  focus:border-primary  focus:ring-primary text-white p-3 w-full bg-transparent sm:text-sm ',
          props.className
        )}
        {...props}
        placeholder={placeholder}
      />
      <div className=" absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2">
        {icon}
      </div>
    </div>
  );
};
export default Input;
interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  icon?: JSX.Element;
}
Input.defaultProps = {
  placeholder: 'Type something',
  icon: undefined,
};
