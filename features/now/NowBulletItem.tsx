interface NowBulletItemProps {
  children: string;
}

export function NowBulletItem({ children }: NowBulletItemProps) {
  return <li>{children}</li>;
}
