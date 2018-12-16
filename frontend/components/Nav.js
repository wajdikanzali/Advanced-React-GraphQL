import Link from 'next/link';

const Nav = () => (
    <div>
        <div>
            <Link href="/">
                <a>Home</a>
            </Link>
        </div>
        <div>
            <Link href="/sell">
                <a>Sell</a>
            </Link>
        </div>
    </div>
)

export default Nav;