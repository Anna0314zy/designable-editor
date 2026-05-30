import './App.css'
import {SHAPE_LIST} from './utils/shapes'
import {ShapeItemThumbnail} from './component/ShapeItemThumbnail'
import { ShapePoolItem } from "./utils/shapes";

const selectShape = (shape:ShapePoolItem) => {
  console.log(shape)
}
function App() {
  return (
    <div className='container'>
      <div className='shape-panel' style={{border:'1px solid #999'}}>
        <div>点击区域</div>
        <div>
          {
            SHAPE_LIST.map((item) => {
              return <div key={item.type}>
                <div>{item.type}</div>
                <div className='shape-item' style={{display:'flex'}}>
                  {
                    item.children.map((shape,index) => {
                      return <ShapeItemThumbnail key={index} shape={shape} onClick={()=>{selectShape(shape)}} />
                    })
                  }
                </div>
              </div>
            })
          }
        </div>
      </div>
      <div className='canvas'>
        <div>画布区</div>
        <div className='shape'>
        </div>
      </div>
    </div>
  )
}

export default App
