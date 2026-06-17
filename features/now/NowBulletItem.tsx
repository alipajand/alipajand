interface NowBulletItemProps {
  children: string;
}

export const NowBulletItem = ({ children }: NowBulletItemProps) => {
  return <li>{children}</li>;
};
