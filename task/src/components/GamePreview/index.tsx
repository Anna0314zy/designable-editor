import { useMemo,memo } from 'react'
const GamePreview = ({props}:{
  props: any
}) => {
    const { gameTemplateId, gameId, gameTemplateName, publicModel, gameUrl } = props
    const env = import.meta.env.MODE
    const gameSrc = useMemo(() => {
      const prefix = `?templateId=${gameTemplateId}&templateName=${gameTemplateName}&publicModel=${publicModel}&openPanel=studentPanel&env=${env}&gameId=${gameId}&role=teacher&v=${Date.now()}`
      let gameSrc = gameUrl?.indexOf('?') > -1 ? `${gameUrl}&v=${Date.now()}` : `${gameUrl}${prefix}`
      const params = new URLSearchParams(gameSrc);
      const hasGameId = params.get("gameId");
      if (!hasGameId) {
        gameSrc = gameSrc + `&gameId=${gameId || ''}`
      }
      return gameSrc
    
    },[gameUrl, gameTemplateId, gameTemplateName, publicModel, env, gameId])
    if (!props) return null
    return (
      <div style={{ transform: 'translate(0px, 0px) rotate(0deg)', height: 960, width: 1280, border: 'none' }}>
       <iframe
          width='100%'
          height='100%'
          src={gameUrl ? gameSrc :''}
          style={{ pointerEvents: 'all' }}
        ></iframe>
      </div>
    )
}
export default memo(GamePreview)