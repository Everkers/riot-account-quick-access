/* eslint-disable react/jsx-props-no-spreading */

const Button = ({ children, ...props }: IProps) => {
  return (
    <button
      type="button"
      className="w-full h-full justify-center inline-flex items-center  border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary "
      {...props}
    >
      {children}
    </button>
  );
};
type IProps = React.InputHTMLAttributes<HTMLButtonElement>;

export default Button;
