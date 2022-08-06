import Link from 'next/link';

export default function Header({ name }) {
  return (
    <header className="p-2">
      <Link href="/">
        <a className="text-2xl dark:text-white text-center">{name}</a>
      </Link>
    </header>
  );
}
