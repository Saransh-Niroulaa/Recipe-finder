import './Navbar.css';

function Navbar({ currentTab, setCurrentTab }) {
  return (
    <nav className="navbar">
      <button 
        className={currentTab === 'ingredients' ? 'nav-btn active' : 'nav-btn'}
        onClick={() => setCurrentTab('ingredients')}
      >
        Search by Ingredients
      </button>
      <button 
        className={currentTab === 'name' ? 'nav-btn active' : 'nav-btn'}
        onClick={() => setCurrentTab('name')}
      >
        Search by Name
      </button>
      <button 
        className={currentTab === 'random' ? 'nav-btn active' : 'nav-btn'}
        onClick={() => setCurrentTab('random')}
      >
        Random Recipe
      </button>
    </nav>
  );
}

export default Navbar;
