interface TextInfo {
    ascent: string,
    descent: string,
    width: string,
    height: string
}
export interface FontType {
    fontFamily: string,
    fontSize: string,
    fontStyle: string,
    fontWeight: string | number,
    isEnd: boolean,
    isStart: boolean,
    text: any[],
    textInfo: TextInfo[],
    width: string,
}