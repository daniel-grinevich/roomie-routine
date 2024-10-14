import NavLink from "./navLink/NavLink";

export default async function Links() {
    const links = [
        { name: 'Home', path: '/' },
        { name: 'Profile', path: '/profile' },
        { name: 'Create Routine', path: '/routine/new' },
    ];


    return (
        <div>
            {links.map((link) => {

                // Render the link as usual
                return <NavLink key={link.path} item={link} />;
            })}
        </div>
    );
}