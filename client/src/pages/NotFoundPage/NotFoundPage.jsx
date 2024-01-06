import { Link } from "react-router-dom";
import "./NotFoundPage.scss";


function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <Link to="/" className="btn primary">Back home</Link>
    </div>
  )
}

export default NotFoundPage