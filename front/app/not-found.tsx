import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-4">
      <h2 className="text-6xl font-bold text-[var(--original-color)] mb-4">404</h2>
      <p className="text-xl text-gray-400 mb-8">Страница не найдена</p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
