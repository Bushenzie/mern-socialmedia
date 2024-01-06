import { Link,Outlet } from "react-router-dom";
import "./shared.scss"

function UnloggedSharedLayout() {
  return (
    <div className="container unlogged">
        <nav className="nav">
            <div className="left">
                <Link to="/"><h3>Social Site Project</h3></Link>
            </div>
            <div className="right">
                <Link className="btn secondary" to="/login">Login</Link>
                <Link  className="btn primary" to="/register">Register</Link>
            </div>
        </nav>
        <Outlet />
    </div>
  )
}

export default UnloggedSharedLayout