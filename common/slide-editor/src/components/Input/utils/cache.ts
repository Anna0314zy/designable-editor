interface FontCacheEntry {
  [property: string]: any;
}

interface FontCache {
  fontCacheSession?: {
    [fontFamily: string]: {
      [cacheKey: string]: FontCacheEntry;
    };
  };

  addEntry(value: any): void;
  getEntry(property: string): any;
  operateCache(style: FontStyle): FontCacheEntry;
  clearCache(style: string): void;
}

interface FontStyle {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  fontStretch: string;
  fontSize: string
}

const fontCache: FontCache = {
  addEntry(value: any): void {
    const cache = this.operateCache(value);
    cache[value['text']] = value;
    // sessionStorage.setItem('fontCache', JSON.stringify(this.fontCacheSession))
  },

  getEntry(property: any): any {
    const cache = this.operateCache(property);
    return cache[property['text']]
  },

  operateCache(style: FontStyle): FontCacheEntry {
    const { fontFamily, fontWeight, fontStyle, fontSize } = style;
    // let fontCacheSessionStr: string | null = sessionStorage.getItem('fontCache')
    // if (!fontCacheSessionStr) {
    //   this.fontCacheSession = {};
    // } else {
    //   this.fontCacheSession = JSON.parse(fontCacheSessionStr)
    // }
    if (!this.fontCacheSession) {
      this.fontCacheSession = {};
    }
    const cache: any = this.fontCacheSession;
    const fontCache = cache[fontFamily] = cache[fontFamily] || {};
    const cacheKey =
      (fontWeight !== 'normal' ? fontWeight : 'normal') +
      (fontStyle !== 'normal' ? fontStyle : 'normal') +
      (fontSize ? fontSize : '60px')
    if (fontCache[cacheKey]) {
      return fontCache[cacheKey]
    } else {
      fontCache[cacheKey] = {};
      // sessionStorage.setItem('fontCache', JSON.stringify(this.fontCacheSession))
      return fontCache[cacheKey];
    }
  },

  clearCache(style: string): void {
    // if (this.__cache) {
    //   this.__cache[style] = null;
    // }
    // sessionStorage.removeItem('fontCache')
  },
};

export default fontCache