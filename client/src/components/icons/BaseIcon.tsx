export type BaseIconProps = React.SVGAttributes<SVGElement>;

export const BaseIcon = (props: BaseIconProps) => {
  const { className, ...rest } = props;
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className={`base-icon ${className}`}
      {...rest}
    />
  );
};
