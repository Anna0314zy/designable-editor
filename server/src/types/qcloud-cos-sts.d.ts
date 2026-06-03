declare module 'qcloud-cos-sts' {
  export function getCredential(
    options: {
      secretId: string
      secretKey: string
      region: string
      durationSeconds: number
      policy: unknown
    },
    callback: (err: Error | null, data: unknown) => void,
  ): void
}
