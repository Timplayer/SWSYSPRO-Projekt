import withRoot from "../withRoot";

function NotFound() {
  return (
    <>
      <h2>404 Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </>
  );
}

export default withRoot(NotFound);