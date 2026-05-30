/*
 * @Date: 2023-12-08 16:13:36
 * @LastEditors: wangpeng
 * @LastEditTime: 2024-01-24 19:24:34
 * @FilePath: /slides-engine/common/slide-editor/src/components/Input/utils/styleOperate.ts
 */
import { Editor, Transforms, Text, Node} from 'slate'

const CustomEditor = {
  SetFontStyle(editor, style, rangeStyle) {
      const currentStyle = {}
      Object.keys(style).forEach(key => {
        if (rangeStyle[key] !== style[key]) {
          currentStyle[key] = style[key]
        }
      })
      Object.keys(currentStyle).forEach((key) => {
        Editor.addMark(editor, key, currentStyle[key])
      })
      // Transforms.setNodes(
      //   editor,
      //   {...currentStyle},
      //   { match: n => Text.isText(n), split: true }
      // )
      CustomEditor.setFontSize(editor, editor.selection)
    },
    setFontSize(editor, selection?) {
      selection = selection || {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      };
      // if (selection) {
      //   const nodesInSelection = Array.from(Editor.nodes(editor, {
      //     at: selection,
      //     match: (n) => (n as unknown as any).type === 'paragraph',
      //   }));
  
      //   nodesInSelection.forEach(([paragraph, path]) => {
      //     const newFontSize = CustomEditor.setMaxFontSize(paragraph);
      //     const newLineheight = CustomEditor.setMaxLineheight(paragraph);
  
      //     Transforms.setNodes(
      //       editor,
      //       {
      //         fontSize: newFontSize,
      //         lineHeight: Math.max(parseInt(newFontSize, 10), parseInt(newLineheight, 10)) + 'px'
      //       } as Partial<Node>, // 增加fontSize属性
      //       {
      //         match: (n) => (n as unknown as any).type === 'paragraph',
      //         at: path,
      //       }
      //     );
      //   });
      // }
    },
    setMaxFontSize(paragraph) {
      let maxFontSize = '16px'; // 初始值为默认字体大小
  
      for (const child of paragraph.children) {
        if (Text.isText(child) && (child as unknown as any).fontSize) {
          const fontSize = parseFloat((child as unknown as any).fontSize);
          if (!isNaN(fontSize) && fontSize > parseFloat(maxFontSize)) {
            maxFontSize = `${fontSize}px`;
          }
        } else if (Node.isNode(child)) {
          const childMaxFontSize = CustomEditor.setMaxFontSize(child);
          if (parseFloat(childMaxFontSize) > parseFloat(maxFontSize)) {
            maxFontSize = childMaxFontSize;
          }
        }
      }
  
      return maxFontSize;
    },
    setMaxLineheight(paragraph) {
      let maxLineheight = '16px'; // 初始值为默认字体大小
  
      for (const child of paragraph.children) {
        if (Text.isText(child) && (child as unknown as any).lineHeight) {
          const lineHeight = parseFloat((child as unknown as any).lineHeight);
          if (!isNaN(lineHeight) && lineHeight > parseFloat(maxLineheight)) {
            maxLineheight = `${lineHeight}px`;
          }
        } else if (Node.isNode(child)) {
          const childMaxLineheight = CustomEditor.setMaxLineheight(child);
          if (parseFloat(childMaxLineheight) > parseFloat(maxLineheight)) {
            maxLineheight = childMaxLineheight;
          }
        }
      }
  
      return maxLineheight;
    }
    // SetFontWeightMark(editor, style) {
    //     Transforms.setNodes(
    //       editor,
    //       { fontWeight: style.fontWeight },
    //       { match: n => Text.isText(n), split: true }
    //     )
    // },
    // SetFontSizeMark(editor, style) {
    //     Transforms.setNodes(
    //       editor,
    //       { fontSize: style.fontSize },
    //       { match: n => Text.isText(n), split: true }
    //     )
    // },
    // SetDecorationMark(editor, style) {
    //     Transforms.setNodes(
    //       editor,
    //       { textDecoration: style.textDecoration },
    //       { match: n => Text.isText(n), split: true }
    //     )
    // },
    // SetFontStyleMark(editor, style) {
    //     Transforms.setNodes(
    //       editor,
    //       { fontStyle: style.fontStyle },
    //       { match: n => Text.isText(n), split: true }
    //     )
    // },
    // SetLineheightMark(editor, style) {
    //     Transforms.setNodes(
    //       editor,
    //       { lineHeight: style.lineHeight },
    //       { match: n => Text.isText(n), split: true }
    //     )
    // },
}

export default CustomEditor