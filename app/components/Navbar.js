import Link from 'next/link';
import NavLinks from './NavLinks';

export default function Navbar() {
    return (
        <nav className="main-nav">
            <Link href="/" className="nav-logo">
                D&D Sheet
            </Link>
            
            <div className="nav-links-container">
                <NavLinks />
            </div>
        </nav>
    );
}
