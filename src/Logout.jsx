export function Logout(props) {
  const handleClick = () => {
    props.handleLogout();
  };

  const linkStyle = {
    cursor: "pointer",
  };

  return (
    <a style={linkStyle} onClick={handleClick}>
      Logout
    </a>
  );
}
