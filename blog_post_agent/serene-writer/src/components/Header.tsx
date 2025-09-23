import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 inline-block"
        >
          BlogDraft
        </Link>
      </div>
    </header>
  );
};

export default Header;