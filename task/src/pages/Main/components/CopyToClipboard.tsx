import { message } from "antd";

interface ICopyToClipboard {
  children:React.ReactNode
  text:string
}
function CopyToClipboard({children,text}:ICopyToClipboard) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
      message.success(`成功复制pageId:${text}`);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return <span onClick={handleCopy}>{children}</span>;
}

export default CopyToClipboard;