export default function Button({ children, onClick, type = "button", color = "blue", disabled = false }) {
  const base = "px-4 py-2 rounded font-semibold transition-colors";
  const colors = {
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    green: "bg-green-500 text-white hover:bg-green-600",
    red: "bg-red-500 text-white hover:bg-red-600",
    gray: "bg-gray-200 text-black hover:bg-gray-300"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${colors[color]} disabled:cursor-not-allowed disabled:opacity-50`}>
      {children}
    </button>
  );
}
