export default function Card({ title, children }) {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
      {children}
    </div>
  );
}
