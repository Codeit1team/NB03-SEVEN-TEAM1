import { ReactNode } from 'react';

type DefaultLayoutProps = {
  children?: ReactNode;
};

type ExtendedLayoutProps = {
  children?: ReactNode;
  modal?: ReactNode;
};

export default function Layout(props: DefaultLayoutProps | ExtendedLayoutProps) {
  const { children, modal } = props as ExtendedLayoutProps;

  return (
    <>
      {children}
      {modal}
    </>
  );
}