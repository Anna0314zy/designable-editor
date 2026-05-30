export const ImgTypeEdit = (props: any) => {
  let imgTypeStyle = {}
  switch (props?.imgType) {
    // 倒影
    case 'inverted':
      imgTypeStyle = {
        WebkitBoxReflect: 'below 0px -webkit-linear-gradient(bottom, rgba(255,255,255,0.3) 0%, transparent 30px, transparent 100%)'
      }
      break
    // 阴影
    case 'shadow':
      imgTypeStyle = {
        boxShadow: '0 0 20px rgba(0,0,0,0.3)'
      }
      break;
    // 圆角
    case 'rounded':
      imgTypeStyle = {
        borderRadius: '20px'
      }
      break;
    // 边框
    case 'border':
      imgTypeStyle = {
        border: '20px solid #fff'
      }
      break;
    default:
      imgTypeStyle = {}
      break;
  }
  return imgTypeStyle
}

export const uploadType = {
  '图片': 'ImageResource',
  '视频': 'VideoResource',
  '音频': 'VideoResource',
}

export const uploadAccept = {
  'pic': '.png,.jpg,jpeg',
  'video': '.mp4',
  'audio': '.mp3',
}


export const uploadpath = (data: any, type: string) => {
  const path = data.find((o) => o.type == type).path

  return path
}

export function imageWH(file: File | Blob): Promise<{ width: number; height: number }> {
  return new Promise(function (resolve, reject) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src); // 释放内存
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
}


export const mediaTime = (file: File): Promise<{ width: number, height: number }> => {
  return new Promise((resolve, reject) => {

    const reader = new FileReader() as any

    reader.onload = () => {

      const media = new Audio(reader.result) as any;

      media.onloadedmetadata = () => {
        resolve(media.duration);
      };

      media.onerror = (error) => {
        reject(error);
      };

    };

    reader.onerror = (error) => {
      reject(error);
    };

    if (file.type.includes('audio')) {
      reader.readAsDataURL(file);
    } else if (file.type.includes('video')) {
      reader.readAsArrayBuffer(file);
    } else {
      reject('Not valid media file');
    }

  });
}

export const getVideoDuration = (file: File) => {
  return new Promise((resolve, reject) => {

    const blob = new Blob([file], { type: 'video/mp4' });

    const url = URL.createObjectURL(blob);

    const video = document.createElement('video');

    video.onloadedmetadata = () => {
      resolve(video.duration);
    };

    video.onerror = (error) => {
      reject(error);
    };

    video.src = url;

  });
}

export const getAudioDuration = (file: File) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.src = URL.createObjectURL(file);
  });
}
