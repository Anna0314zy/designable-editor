
import { Link } from "react-router-dom"
import { Space } from "antd"
function Home() {
    return <div>
      <main>
        <h2>Welcome to the homepage</h2>
      </main>
      <nav>
        <Space>
        {/* <Link to="/task/24b0680cca6545bb9b0a74354b400617">任务</Link> */}
        {/* <Link to="/course">课件列表</Link> */}
        </Space>
      </nav>
    </div>
  }
  
  export default Home