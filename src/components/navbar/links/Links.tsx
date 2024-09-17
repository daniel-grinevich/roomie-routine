import NavLink from "./navLink/NavLink";

export default function Links() {
    const links = [
        { name: 'Home', path: '/' },
        { name: 'Profile', path: '/profile' },
    ];
    const isUser = true;
    const isAdmin = true; // Assuming you may use this elsewhere

    return (
        <div>
            {links.map((link) => {
                {/* If a user is logged in, change 'Profile' to 'Hello Daniel Grinevich'; otherwise, show 'Login' */}
                if (isUser && link.name === 'Profile') {
                    return <NavLink key={link.path} item={{ path: link.path, name: 'Hello Daniel Grinevich' }} />;
                }

                // Render the link as usual
                return <NavLink key={link.path} item={link} />;
            })}
        </div>
    );
}