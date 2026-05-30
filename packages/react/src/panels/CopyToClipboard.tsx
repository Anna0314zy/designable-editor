import { message } from "antd";

interface ICopyToClipboard {
  children:React.ReactNode
  text:string
  msg?:string
}
function CopyToClipboard({children,text,msg = `成功复制pageId:${text}`}:ICopyToClipboard) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(msg);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return <span onClick={handleCopy}>{children}</span>;
}

export default CopyToClipboard;