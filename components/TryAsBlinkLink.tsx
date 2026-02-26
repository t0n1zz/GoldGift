"use client";

const LOCAL_MESSAGE =
  "Blinks won't work on localhost. Deploy your app and set NEXT_PUBLIC_APP_URL to your production URL to try Blinks.";

export function TryAsBlinkLink({
  href,
  isLocal,
  className,
  children,
}: {
  href: string;
  isLocal: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLocal) {
      e.preventDefault();
      alert(LOCAL_MESSAGE);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
