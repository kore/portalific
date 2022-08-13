export default function Module({ children }) {
  return (
    <li className="border border-b-0 border-gray-800/10 bg-white/10 p-4 backdrop-blur-lg transition last:border-b hover:border-b hover:bg-white/20 hovered-sibling:border-t-0 dark:border-white/10 dark:bg-black/30 dark:hover:bg-black/50 md:first:rounded-t-lg md:last:rounded-b-lg">
      {children}
    </li>
  );
}
