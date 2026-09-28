const Loader = ({ className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#702ae1]" />
  </div>
);

export default Loader;
