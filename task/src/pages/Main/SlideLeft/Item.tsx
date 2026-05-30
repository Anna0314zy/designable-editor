
import { memo } from 'react'
import ThumbnailPanel, { DEFAULT_WIDTH, DEFAULT_HEIGHT } from './ThumbnailPanel'
import { Page, PageType } from '@/store/models/page'
interface ItemProps {
    data: Page;
    globalProps:any
}

const Item = ({ data,globalProps }: ItemProps) => {
    return (
        data.pageType === PageType.gamePage ? (
            <div className="game-pic" style={{
                position: 'relative',
                top: 0,
                left: 0,
                width: DEFAULT_WIDTH,
                height: DEFAULT_HEIGHT,
                background: `url(${data.children?.[0]?.props?.cover
                }) center/contain no-repeat`
            }}>
            </div>) : <ThumbnailPanel data={data} globalProps={globalProps}/>
    )
}
export default memo(Item)