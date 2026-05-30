
import { Link } from 'react-router-dom'
function About() {
    return <div>
      <main>
        <h2>Welcome to the about page</h2>
      </main>
      <nav>
        <ol>
          <Link to="/">home</Link>
          <Link to="/about">about</Link>
        </ol>
  
      </nav>
    </div>
  }
  
 export default About